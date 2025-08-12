import request from "supertest";
import app from "../../app";
import sequelize from "../../config/database";
import { GameBox, Ticket, User, UserStatistics } from "../../models";

describe("Ticket Endpoints", () => {
    let authCookie: string;
    let testUser: User;

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
            username: "testuser",
            email: "test@example.com",
            password: "TestPass123",
        });

        // Extract cookie from headers
        const cookies =
            registerResponse.headers["set-cookie"] || registerResponse.headers["Set-Cookie"];
        authCookie = Array.isArray(cookies) ? cookies[0] : cookies;

        if (!authCookie) {
            // Try logging in if registration didn't set cookie
            const loginResponse = await request(app).post("/api/auth/login").send({
                username: "testuser",
                password: "TestPass123",
            });
            const loginCookies =
                loginResponse.headers["set-cookie"] || loginResponse.headers["Set-Cookie"];
            authCookie = Array.isArray(loginCookies) ? loginCookies[0] : loginCookies;
        }

        testUser = (await User.findOne({ where: { username: "testuser" } })) as User;
    });

    describe("POST /api/tickets/purchase", () => {
        it("should purchase a ticket successfully", async () => {
            const response = await request(app)
                .post("/api/tickets/purchase")
                .set("Cookie", authCookie);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Ticket purchased successfully");
            expect(response.body.ticket).toHaveProperty("id");
            expect(response.body.ticket).toHaveProperty("gameBoxId");
            expect(response.body.ticket).toHaveProperty("createdAt");
            // Should not reveal symbols initially
            expect(response.body.ticket.symbols).toBeUndefined();
        });

        it("should create a game box if none exists", async () => {
            const response = await request(app)
                .post("/api/tickets/purchase")
                .set("Cookie", authCookie);

            expect(response.status).toBe(201);

            const gameBox = await GameBox.findOne();
            expect(gameBox).toBeTruthy();
            expect(gameBox?.total_tickets).toBe(500);
            expect(gameBox?.remaining_tickets).toBe(499); // One ticket purchased
        });

        it("should update user statistics", async () => {
            await request(app).post("/api/tickets/purchase").set("Cookie", authCookie);

            const stats = await UserStatistics.findOne({
                where: { user_id: testUser.id },
            });

            expect(stats?.tickets_played).toBe(1);
            expect(stats?.last_played).toBeDefined();
        });

        it("should require authentication", async () => {
            const response = await request(app).post("/api/tickets/purchase");

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Authentication required");
        });
    });

    describe("GET /api/tickets/:id", () => {
        let ticketId: number;

        beforeEach(async () => {
            const purchaseResponse = await request(app)
                .post("/api/tickets/purchase")
                .set("Cookie", authCookie);

            ticketId = purchaseResponse.body.ticket.id;
        });

        it("should get ticket details", async () => {
            const response = await request(app)
                .get(`/api/tickets/${ticketId}`)
                .set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.ticket.id).toBe(ticketId);
            expect(response.body.ticket).toHaveProperty("revealedTabs");
            expect(response.body.ticket.isFullyRevealed).toBe(false);
        });

        it("should not show symbols for unrevealed ticket", async () => {
            const response = await request(app)
                .get(`/api/tickets/${ticketId}`)
                .set("Cookie", authCookie);

            expect(response.body.ticket.symbols).toBeUndefined();
            expect(response.body.ticket.winningLines).toBeUndefined();
        });

        it("should return 404 for non-existent ticket", async () => {
            const response = await request(app).get("/api/tickets/99999").set("Cookie", authCookie);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Ticket not found");
        });

        it("should not allow access to other user's ticket", async () => {
            // Create another user
            const otherUserResponse = await request(app).post("/api/auth/register").send({
                username: "otheruser",
                email: "other@example.com",
                password: "OtherPass123",
            });

            const otherCookie = otherUserResponse.headers["set-cookie"][0];

            const response = await request(app)
                .get(`/api/tickets/${ticketId}`)
                .set("Cookie", otherCookie);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Ticket not found");
        });
    });

    describe("POST /api/tickets/:id/reveal", () => {
        let ticketId: number;

        beforeEach(async () => {
            const purchaseResponse = await request(app)
                .post("/api/tickets/purchase")
                .set("Cookie", authCookie);

            ticketId = purchaseResponse.body.ticket.id;
        });

        it("should reveal a tab successfully", async () => {
            const response = await request(app)
                .post(`/api/tickets/${ticketId}/reveal`)
                .set("Cookie", authCookie)
                .send({ tabIndex: 0 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Tab 1 revealed");
            expect(response.body.tab.index).toBe(0);
            expect(response.body.tab.symbols).toHaveLength(3);
            expect(response.body.tab).toHaveProperty("winDetected");
        });

        it("should reveal all tabs sequentially", async () => {
            for (let i = 0; i < 5; i++) {
                const response = await request(app)
                    .post(`/api/tickets/${ticketId}/reveal`)
                    .set("Cookie", authCookie)
                    .send({ tabIndex: i });

                expect(response.status).toBe(200);
                expect(response.body.tab.index).toBe(i);
            }
        });

        it("should show payout when win is detected", async () => {
            // Create a winning ticket manually
            const gameBox = await GameBox.create(GameBox.createNewBox());
            const winningSymbols = new Array(15).fill(0);
            winningSymbols[0] = 0; // SKULL
            winningSymbols[1] = 0; // SKULL
            winningSymbols[2] = 1; // TREASURE - $50 win

            const winningTicket = await Ticket.create({
                user_id: testUser.id,
                game_box_id: gameBox.id,
                symbols: winningSymbols,
                winning_lines: [{ line: 1, symbols: [0, 0, 1], prize: 50 }],
                total_payout: 50,
                is_winner: true,
            });

            const response = await request(app)
                .post(`/api/tickets/${winningTicket.id}/reveal`)
                .set("Cookie", authCookie)
                .send({ tabIndex: 0 });

            expect(response.status).toBe(200);
            expect(response.body.tab.winDetected).toBe(true);
            expect(response.body.totalPayout).toBe(50);
        });

        it("should reject invalid tab index", async () => {
            const response = await request(app)
                .post(`/api/tickets/${ticketId}/reveal`)
                .set("Cookie", authCookie)
                .send({ tabIndex: 5 });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid tab index (must be 0-4)");
        });

        it("should require tab index", async () => {
            const response = await request(app)
                .post(`/api/tickets/${ticketId}/reveal`)
                .set("Cookie", authCookie)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid tab index (must be 0-4)");
        });
    });

    describe("GET /api/tickets", () => {
        beforeEach(async () => {
            // Purchase multiple tickets
            for (let i = 0; i < 5; i++) {
                await request(app).post("/api/tickets/purchase").set("Cookie", authCookie);
            }
        });

        it("should get user's ticket history", async () => {
            const response = await request(app).get("/api/tickets").set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.tickets).toHaveLength(5);
            expect(response.body.total).toBe(5);
            expect(response.body.limit).toBe(10);
            expect(response.body.offset).toBe(0);
        });

        it("should support pagination", async () => {
            const response = await request(app)
                .get("/api/tickets?limit=2&offset=1")
                .set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.tickets).toHaveLength(2);
            expect(response.body.total).toBe(5);
            expect(response.body.limit).toBe(2);
            expect(response.body.offset).toBe(1);
        });

        it("should validate limit parameter", async () => {
            const response = await request(app)
                .get("/api/tickets?limit=101")
                .set("Cookie", authCookie);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Limit must be between 1 and 100");
        });

        it("should return tickets in descending order", async () => {
            const response = await request(app).get("/api/tickets").set("Cookie", authCookie);

            const ticketIds = response.body.tickets.map((t: { id: number }) => t.id);
            const sortedIds = [...ticketIds].sort((a, b) => b - a);
            expect(ticketIds).toEqual(sortedIds);
        });
    });
});
