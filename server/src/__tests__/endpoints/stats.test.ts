import request from "supertest";
import app from "../../app";
import sequelize from "../../config/database";
import { User, UserStatistics, GameBox, Ticket } from "../../models";
import { GameSymbol } from "../../models/Ticket";

describe("Statistics Endpoints", () => {
    let authCookie: string;
    let testUser: User;
    let gameBox: GameBox;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await Ticket.destroy({ where: {} });
        await UserStatistics.destroy({ where: {} });
        await GameBox.destroy({ where: {} });
        await User.destroy({ where: {} });

        // Create and login test user
        const registerResponse = await request(app).post("/api/auth/register").send({
            email: "test@example.com",
            password: "TestPass123",
        });

        // Extract cookie from headers
        const cookies = registerResponse.headers["set-cookie"] || registerResponse.headers["Set-Cookie"];
        authCookie = Array.isArray(cookies) ? cookies[0] : cookies;
        
        if (!authCookie) {
            // Try logging in if registration didn't set cookie
            const loginResponse = await request(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "TestPass123",
            });
            const loginCookies = loginResponse.headers["set-cookie"] || loginResponse.headers["Set-Cookie"];
            authCookie = Array.isArray(loginCookies) ? loginCookies[0] : loginCookies;
        }
        
        testUser = (await User.findOne({ where: { email: "test@example.com" } })) as User;

        // Create a game box
        gameBox = await GameBox.create(GameBox.createNewBox());
    });

    describe("GET /api/stats", () => {
        beforeEach(async () => {
            // Create some test tickets
            await Ticket.create({
                user_id: testUser.id,
                game_box_id: gameBox.id,
                symbols: new Array(15).fill(GameSymbol.MAP),
                winning_lines: [],
                total_payout: 0,
                is_winner: false,
            });

            // Create a winning ticket
            const winningSymbols = new Array(15).fill(GameSymbol.MAP);
            winningSymbols[0] = GameSymbol.SKULL;
            winningSymbols[1] = GameSymbol.SKULL;
            winningSymbols[2] = GameSymbol.TREASURE;

            await Ticket.create({
                user_id: testUser.id,
                game_box_id: gameBox.id,
                symbols: winningSymbols,
                winning_lines: [{ line: 1, symbols: [0, 0, 1], prize: 50 }],
                total_payout: 50,
                is_winner: true,
            });

            // Update user statistics
            const stats = await UserStatistics.findOne({
                where: { user_id: testUser.id },
            });
            if (stats) {
                stats.tickets_played = 2;
                stats.total_winnings = 50;
                stats.biggest_win = 50;
                await stats.save();
            }
        });

        it("should get user statistics", async () => {
            const response = await request(app).get("/api/stats").set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.statistics).toMatchObject({
                ticketsPlayed: 2,
                totalWinnings: 50,
                biggestWin: 50,
                winningTickets: 1,
                losingTickets: 1,
                totalSpent: 2,
                netProfit: 48,
                winRate: 50,
            });
        });

        it("should calculate average win correctly", async () => {
            const response = await request(app).get("/api/stats").set("Cookie", authCookie);

            expect(response.body.statistics.averageWin).toBe(50);
        });

        it("should require authentication", async () => {
            const response = await request(app).get("/api/stats");

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Authentication required");
        });

        it("should handle user with no statistics", async () => {
            // Create a new user without stats
            const newUserResponse = await request(app).post("/api/auth/register").send({
                email: "new@example.com",
                password: "NewPass123",
            });

            const newCookies = newUserResponse.headers["set-cookie"] || newUserResponse.headers["Set-Cookie"];
            const newCookie = Array.isArray(newCookies) ? newCookies[0] : newCookies;

            const response = await request(app).get("/api/stats").set("Cookie", newCookie);

            expect(response.status).toBe(200);
            expect(response.body.statistics.ticketsPlayed).toBe(0);
            expect(response.body.statistics.winRate).toBe(0);
        });
    });

    describe("GET /api/stats/session", () => {
        beforeEach(async () => {
            // Create tickets within session window
            await Ticket.create({
                user_id: testUser.id,
                game_box_id: gameBox.id,
                symbols: new Array(15).fill(GameSymbol.MAP),
                winning_lines: [],
                total_payout: 0,
                is_winner: false,
                created_at: new Date(),
            });

            // Create a winning ticket
            const winningSymbols = new Array(15).fill(GameSymbol.MAP);
            winningSymbols[3] = GameSymbol.SKULL;
            winningSymbols[4] = GameSymbol.SKULL;
            winningSymbols[5] = GameSymbol.SHIP;

            await Ticket.create({
                user_id: testUser.id,
                game_box_id: gameBox.id,
                symbols: winningSymbols,
                winning_lines: [{ line: 2, symbols: [0, 0, 2], prize: 20 }],
                total_payout: 20,
                is_winner: true,
                created_at: new Date(),
            });

            // Create an old ticket (outside session window)
            const oldDate = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
            const oldTicket = await Ticket.create({
                user_id: testUser.id,
                game_box_id: gameBox.id,
                symbols: new Array(15).fill(GameSymbol.MAP),
                winning_lines: [],
                total_payout: 0,
                is_winner: false,
            });
            // Manually update the created_at since Sequelize might not respect it during create
            await oldTicket.update({ created_at: oldDate });
        });

        it("should get session statistics for last 24 hours", async () => {
            const response = await request(app).get("/api/stats/session").set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.sessionStatistics).toMatchObject({
                ticketsPlayed: 2, // Only tickets from last 24 hours
                winningTickets: 1,
                totalWinnings: 20,
                biggestWin: 20,
                netProfit: 18, // 20 - 2
                winRate: 50,
            });
        });

        it("should handle empty session", async () => {
            // Delete all recent tickets
            await Ticket.destroy({ where: { user_id: testUser.id } });

            const response = await request(app).get("/api/stats/session").set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.sessionStatistics).toMatchObject({
                ticketsPlayed: 0,
                winningTickets: 0,
                totalWinnings: 0,
                biggestWin: 0,
                netProfit: 0,
                winRate: 0,
            });
        });
    });

    describe("GET /api/stats/leaderboard", () => {
        beforeEach(async () => {
            // Create multiple users with different stats
            const users = [
                { email: "p1@test.com", winnings: 500 },
                { email: "p2@test.com", winnings: 300 },
                { email: "p3@test.com", winnings: 750 },
            ];

            for (const userData of users) {
                const user = await User.create({
                    email: userData.email,
                    password_hash: "password123",
                });

                await UserStatistics.create({
                    user_id: user.id,
                    tickets_played: 10,
                    total_winnings: userData.winnings,
                    biggest_win: userData.winnings / 2,
                    sessions_played: 1,
                });
            }
        });

        it("should get leaderboard sorted by total winnings", async () => {
            const response = await request(app).get("/api/stats/leaderboard?limit=3");

            expect(response.status).toBe(200);
            expect(response.body.leaderboard).toHaveLength(3);
            expect(response.body.leaderboard[0].email).toBe("p3@test.com");
            expect(response.body.leaderboard[0].value).toBe(750);
            expect(response.body.leaderboard[0].rank).toBe(1);
        });

        it("should support different metrics", async () => {
            const response = await request(app).get(
                "/api/stats/leaderboard?metric=tickets_played&limit=3"
            );

            expect(response.status).toBe(200);
            expect(response.body.metric).toBe("tickets_played");
        });

        it("should validate metric parameter", async () => {
            const response = await request(app).get("/api/stats/leaderboard?metric=invalid_metric");

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid metric");
        });

        it("should be a public endpoint", async () => {
            // No authentication required
            const response = await request(app).get("/api/stats/leaderboard?limit=5");

            expect(response.status).toBe(200);
            expect(response.body.leaderboard).toBeDefined();
        });
    });
});
