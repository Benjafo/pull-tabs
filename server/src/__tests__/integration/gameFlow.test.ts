import request from "supertest";
import app from "../../app";
import sequelize from "../../config/database";
import { User, UserStatistics, GameBox, Ticket } from "../../models";

describe("Game Flow Integration Tests", () => {
    let authCookie: string;
    let userId: number;

    beforeAll(async () => {
        try {
            await sequelize.sync({ force: true });
        } catch (error) {
            // If force sync fails, try to manually clean up
            await sequelize.query('TRUNCATE TABLE tickets, user_statistics, game_boxes, users CASCADE');
        }
    });

    beforeEach(async () => {
        await Ticket.destroy({ where: {} });
        await UserStatistics.destroy({ where: {} });
        await GameBox.destroy({ where: {} });
        await User.destroy({ where: {} });

        // Create and login test user
        const registerResponse = await request(app).post("/api/auth/register").send({
            username: "testplayer",
            email: "player@example.com",
            password: "PlayerPass123",
        });

        // Check if registration was successful
        if (registerResponse.status !== 201) {
            console.error("Registration failed:", registerResponse.body);
        }

        authCookie = registerResponse.headers["set-cookie"]?.[0] || registerResponse.headers["Set-Cookie"]?.[0];
        if (!authCookie) {
            // Try logging in if registration didn't set cookie
            const loginResponse = await request(app).post("/api/auth/login").send({
                username: "testplayer",
                password: "PlayerPass123",
            });
            authCookie = loginResponse.headers["set-cookie"]?.[0] || loginResponse.headers["Set-Cookie"]?.[0];
            if (!authCookie) {
                throw new Error("No cookie received from registration or login");
            }
        }
        const user = await User.findOne({ where: { username: "testplayer" } });
        userId = user!.id;
    });

    describe("Complete Game Flow", () => {
        it("should handle complete ticket lifecycle", async () => {
            // 1. Check initial game box
            const initialBoxResponse = await request(app).get("/api/gamebox/current");
            expect(initialBoxResponse.body.gameBox.remainingTickets).toBe(500);

            // 2. Purchase a ticket
            const purchaseResponse = await request(app)
                .post("/api/tickets/purchase")
                .set("Cookie", authCookie);

            expect(purchaseResponse.status).toBe(201);
            const ticketId = purchaseResponse.body.ticket.id;

            // 3. Get ticket details (unrevealed)
            const unrevealedResponse = await request(app)
                .get(`/api/tickets/${ticketId}`)
                .set("Cookie", authCookie);

            expect(unrevealedResponse.body.ticket.isFullyRevealed).toBe(false);
            expect(unrevealedResponse.body.ticket.symbols).toBeUndefined();

            // 4. Reveal all tabs
            const revealedSymbols: number[] = [];
            for (let i = 0; i < 5; i++) {
                const revealResponse = await request(app)
                    .post(`/api/tickets/${ticketId}/reveal`)
                    .set("Cookie", authCookie)
                    .send({ tabIndex: i });

                expect(revealResponse.status).toBe(200);
                revealedSymbols.push(...revealResponse.body.tab.symbols);
            }

            // 5. Get fully revealed ticket
            const revealedResponse = await request(app)
                .get(`/api/tickets/${ticketId}`)
                .set("Cookie", authCookie);

            expect(revealedResponse.body.ticket.isFullyRevealed).toBe(true);
            expect(revealedResponse.body.ticket.symbols).toEqual(revealedSymbols);

            // 6. Check user statistics
            const statsResponse = await request(app).get("/api/stats").set("Cookie", authCookie);

            expect(statsResponse.body.statistics.ticketsPlayed).toBe(1);

            // 7. Check game box was updated
            const updatedBoxResponse = await request(app).get("/api/gamebox/current");
            expect(updatedBoxResponse.body.gameBox.remainingTickets).toBe(499);
        });

        it("should handle multiple users concurrently", async () => {
            // Create multiple users
            const users = [];
            for (let i = 0; i < 3; i++) {
                const registerResponse = await request(app)
                    .post("/api/auth/register")
                    .send({
                        username: `player${i}`,
                        email: `player${i}@example.com`,
                        password: "PlayerPass123",
                    });

                users.push({
                    cookie: registerResponse.headers["set-cookie"][0],
                    username: `player${i}`,
                });
            }

            // Each user purchases tickets
            const purchases = await Promise.all(
                users.map((user) =>
                    request(app).post("/api/tickets/purchase").set("Cookie", user.cookie)
                )
            );

            purchases.forEach((response) => {
                expect(response.status).toBe(201);
            });

            // Check game box updated correctly
            const boxResponse = await request(app).get("/api/gamebox/current");
            expect(boxResponse.body.gameBox.remainingTickets).toBe(497); // 500 - 3
        });
    });

    describe("Win Rate and Odds Validation", () => {
        it("should maintain expected win rate over many tickets", async () => {
            const results = {
                wins: 0,
                losses: 0,
                totalPayout: 0,
                prizeDistribution: {} as Record<number, number>,
            };

            // Purchase 100 tickets to test odds
            for (let i = 0; i < 100; i++) {
                // Purchase ticket
                const purchaseResponse = await request(app)
                    .post("/api/tickets/purchase")
                    .set("Cookie", authCookie);

                const ticketId = purchaseResponse.body.ticket.id;

                // Reveal all tabs
                for (let tab = 0; tab < 5; tab++) {
                    await request(app)
                        .post(`/api/tickets/${ticketId}/reveal`)
                        .set("Cookie", authCookie)
                        .send({ tabIndex: tab });
                }

                // Get final ticket state
                const ticket = await Ticket.findByPk(ticketId);
                if (ticket!.is_winner) {
                    results.wins++;
                    results.totalPayout += Number(ticket!.total_payout);
                    const payout = Number(ticket!.total_payout);
                    results.prizeDistribution[payout] =
                        (results.prizeDistribution[payout] || 0) + 1;
                } else {
                    results.losses++;
                }
            }

            // Expected win rate is ~28.4%
            const winRate = (results.wins / 100) * 100;
            console.log(`Win Rate: ${winRate}% (Expected: ~28.4%)`);
            console.log(`Total Payout: $${results.totalPayout} from $100 spent`);
            console.log(`Prize Distribution:`, results.prizeDistribution);

            // Allow for variance in random distribution
            expect(winRate).toBeGreaterThan(15); // Lower bound
            expect(winRate).toBeLessThan(45); // Upper bound
        });

        it("should enforce winner limits per box", async () => {
            // Create a box with only one $100 winner
            const gameBox = await GameBox.create({
                ...GameBox.createNewBox(),
                remaining_tickets: 2,
                winners_remaining: {
                    100: 1,
                    50: 0,
                    20: 0,
                    10: 0,
                    5: 0,
                    2: 0,
                },
            });

            let winnersFound = 0;

            // Purchase both remaining tickets
            for (let i = 0; i < 2; i++) {
                const purchaseResponse = await request(app)
                    .post("/api/tickets/purchase")
                    .set("Cookie", authCookie);

                const ticketId = purchaseResponse.body.ticket.id;
                const ticket = await Ticket.findByPk(ticketId);

                if (ticket!.is_winner) {
                    winnersFound++;
                    expect(ticket!.total_payout).toBe("100.00");
                }
            }

            // Exactly one winner should be found
            expect(winnersFound).toBe(1);

            // Box should be complete
            const updatedBox = await GameBox.findByPk(gameBox.id);
            expect(updatedBox!.remaining_tickets).toBe(0);
            expect(updatedBox!.completed_at).not.toBeNull();
        });
    });

    describe("Session Management", () => {
        it("should track session statistics correctly", async () => {
            // Purchase tickets
            for (let i = 0; i < 5; i++) {
                await request(app).post("/api/tickets/purchase").set("Cookie", authCookie);
            }

            // Get session stats
            const sessionResponse = await request(app)
                .get("/api/stats/session")
                .set("Cookie", authCookie);

            expect(sessionResponse.body.sessionStatistics.ticketsPlayed).toBe(5);

            // Get overall stats
            const overallResponse = await request(app).get("/api/stats").set("Cookie", authCookie);

            expect(overallResponse.body.statistics.ticketsPlayed).toBe(5);
            expect(overallResponse.body.statistics.sessionsPlayed).toBe(1);
        });
    });

    describe("Error Handling", () => {
        it("should handle database errors gracefully", async () => {
            // Force close database connection
            await sequelize.close();

            const response = await request(app)
                .post("/api/tickets/purchase")
                .set("Cookie", authCookie);

            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();

            // Reconnect for cleanup
            await sequelize.authenticate();
        });

        it("should handle concurrent ticket purchases", async () => {
            // Create multiple purchase requests simultaneously
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(request(app).post("/api/tickets/purchase").set("Cookie", authCookie));
            }

            const responses = await Promise.all(promises);

            // All should succeed
            responses.forEach((response) => {
                expect(response.status).toBe(201);
            });

            // Check tickets were created correctly
            const tickets = await Ticket.count({ where: { user_id: userId } });
            expect(tickets).toBe(10);
        });
    });
});
