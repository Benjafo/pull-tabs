import request from "supertest";
import app from "../../app";
import sequelize from "../../config/database";
import { GameBox, Ticket, User, UserStatistics } from "../../models";
import { GameSymbol } from "../../models/Ticket";

describe("GameBox Endpoints", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        // Clean up in correct order to respect foreign keys
        await Ticket.destroy({ where: {} });
        await UserStatistics.destroy({ where: {} });
        await GameBox.destroy({ where: {} });
        await User.destroy({ where: {} });
    });

    describe("GET /api/gamebox/current", () => {
        it("should get current game box status", async () => {
            // Create a game box
            const gameBox = await GameBox.create({
                ...GameBox.createNewBox(),
                remaining_tickets: 450,
            });

            const response = await request(app).get("/api/gamebox/current");

            expect(response.status).toBe(200);
            expect(response.body.gameBox).toMatchObject({
                id: gameBox.id,
                totalTickets: 500,
                remainingTickets: 450,
                soldTickets: 50,
                percentSold: 10,
                totalWinnersRemaining: 142,
                isComplete: false,
            });
        });

        it("should create new game box if none exists", async () => {
            const response = await request(app).get("/api/gamebox/current");

            expect(response.status).toBe(200);
            expect(response.body.gameBox.totalTickets).toBe(500);
            expect(response.body.gameBox.remainingTickets).toBe(500);
            expect(response.body.gameBox.soldTickets).toBe(0);
        });

        it("should show correct winner distribution", async () => {
            const response = await request(app).get("/api/gamebox/current");

            expect(response.body.gameBox.winnersRemaining).toEqual({
                1: 64,
                2: 48,
                5: 10,
                10: 10,
                20: 2,
                100: 1,
            });
        });

        it("should handle completed game box", async () => {
            // Create a completed game box
            await GameBox.create({
                ...GameBox.createNewBox(),
                remaining_tickets: 0,
                completed_at: new Date(),
            });

            // Should create a new one
            const response = await request(app).get("/api/gamebox/current");

            expect(response.status).toBe(200);
            expect(response.body.gameBox.remainingTickets).toBe(500);
            expect(response.body.gameBox.isComplete).toBe(false);
        });

        it("should be a public endpoint", async () => {
            // No authentication required
            const response = await request(app).get("/api/gamebox/current");

            expect(response.status).toBe(200);
            expect(response.body.gameBox).toBeDefined();
        });

        it("should update after ticket purchases", async () => {
            // Register a user
            const registerResponse = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "TestPass123",
            });

            const authCookie = registerResponse.headers["set-cookie"][0];

            // Get initial state
            const initialResponse = await request(app).get("/api/gamebox/current");
            const initialRemaining = initialResponse.body.gameBox.remainingTickets;

            // Purchase a ticket
            await request(app).post("/api/tickets/purchase").set("Cookie", authCookie);

            // Check updated state
            const updatedResponse = await request(app).get("/api/gamebox/current");
            expect(updatedResponse.body.gameBox.remainingTickets).toBe(initialRemaining - 1);
            expect(updatedResponse.body.gameBox.soldTickets).toBe(1);
        });
    });

    describe("Game Box Winner Distribution", () => {
        it("should track winner depletion correctly", async () => {
            // Create a game box with limited winners
            const gameBox = await GameBox.create({
                ...GameBox.createNewBox(),
                remaining_tickets: 10,
                winners_remaining: {
                    100: 0,
                    20: 0,
                    10: 0,
                    5: 0,
                    2: 0,
                    1: 0,
                },
            });

            // Register a user
            await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "TestPass123",
            });

            // authCookie not needed for this test
            const testUser = await User.findOne({ where: { email: "test@example.com" } });

            // Manually create a winning ticket to simulate winner depletion
            await Ticket.create({
                user_id: testUser!.id,
                game_box_id: gameBox.id,
                symbols: new Array(15).fill(GameSymbol.MAP),
                winning_lines: [{ line: 1, symbols: [0, 0, 1], prize: 20 }],
                total_payout: 20,
                is_winner: true,
            });

            // Update game box manually
            await gameBox.useWinner(20);
            await gameBox.useTicket();

            // Check game box status
            const response = await request(app).get("/api/gamebox/current");

            expect(response.body.gameBox.winnersRemaining[20]).toBe(0);
            expect(response.body.gameBox.totalWinnersRemaining).toBe(0);
        });
    });
});
