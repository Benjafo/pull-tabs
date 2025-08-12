import sequelize from "../../config/database";
import { User, UserStatistics, GameBox, Ticket } from "../../models";
import { GameSymbol } from "../../models/Ticket";
import "../../models/associations";

describe("Model Relationships", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await Ticket.destroy({ where: {} });
        await UserStatistics.destroy({ where: {} });
        await GameBox.destroy({ where: {} });
        await User.destroy({ where: {} });
    });

    describe("User - UserStatistics Relationship", () => {
        it("should create one-to-one relationship", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            const stats = await UserStatistics.create({
                user_id: user.id,
                tickets_played: 10,
                total_winnings: 100,
                biggest_win: 50,
                sessions_played: 3,
            });

            // Test association from UserStatistics to User
            const statsWithUser = await UserStatistics.findByPk(stats.id, {
                include: [User],
            });
            expect(statsWithUser?.User).toBeDefined();
            expect(statsWithUser?.User?.username).toBe("testuser");

            // Test association from User to UserStatistics
            const userWithStats = await User.findByPk(user.id, {
                include: [UserStatistics],
            });
            expect(userWithStats?.UserStatistic).toBeDefined();
            expect(userWithStats?.UserStatistic?.tickets_played).toBe(10);
        });

        it("should enforce unique user_id in UserStatistics", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            await UserStatistics.create({
                user_id: user.id,
                tickets_played: 0,
                total_winnings: 0,
                biggest_win: 0,
                sessions_played: 1,
            });

            await expect(
                UserStatistics.create({
                    user_id: user.id,
                    tickets_played: 0,
                    total_winnings: 0,
                    biggest_win: 0,
                    sessions_played: 1,
                })
            ).rejects.toThrow();
        });
    });

    describe("User - Ticket Relationship", () => {
        it("should create one-to-many relationship", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            const gameBox = await GameBox.create(GameBox.createNewBox());

            const ticket1 = await Ticket.create({
                user_id: user.id,
                game_box_id: gameBox.id,
                symbols: Array(15).fill(GameSymbol.ANCHOR),
                winning_lines: [],
                total_payout: 0,
                is_winner: false,
            });

            const ticket2 = await Ticket.create({
                user_id: user.id,
                game_box_id: gameBox.id,
                symbols: Array(15).fill(GameSymbol.MAP),
                winning_lines: [],
                total_payout: 0,
                is_winner: false,
            });

            // Test association from User to Tickets
            const userWithTickets = await User.findByPk(user.id, {
                include: [Ticket],
            });
            expect(userWithTickets?.Tickets).toHaveLength(2);
            expect(userWithTickets?.Tickets?.[0].id).toBe(ticket1.id);
            expect(userWithTickets?.Tickets?.[1].id).toBe(ticket2.id);

            // Test association from Ticket to User
            const ticketWithUser = await Ticket.findByPk(ticket1.id, {
                include: [User],
            });
            expect(ticketWithUser?.User).toBeDefined();
            expect(ticketWithUser?.User?.username).toBe("testuser");
        });
    });

    describe("GameBox - Ticket Relationship", () => {
        it("should create one-to-many relationship", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            const gameBox = await GameBox.create(GameBox.createNewBox());

            const ticket1 = await Ticket.create({
                user_id: user.id,
                game_box_id: gameBox.id,
                symbols: Array(15).fill(GameSymbol.SHIP),
                winning_lines: [],
                total_payout: 0,
                is_winner: false,
            });

            await Ticket.create({
                user_id: user.id,
                game_box_id: gameBox.id,
                symbols: Array(15).fill(GameSymbol.COMPASS),
                winning_lines: [],
                total_payout: 0,
                is_winner: false,
            });

            // Test association from GameBox to Tickets
            const boxWithTickets = await GameBox.findByPk(gameBox.id, {
                include: [Ticket],
            });
            expect(boxWithTickets?.Tickets).toHaveLength(2);
            expect(boxWithTickets?.Tickets?.[0].game_box_id).toBe(gameBox.id);
            expect(boxWithTickets?.Tickets?.[1].game_box_id).toBe(gameBox.id);

            // Test association from Ticket to GameBox
            const ticketWithBox = await Ticket.findByPk(ticket1.id, {
                include: [GameBox],
            });
            expect(ticketWithBox?.GameBox).toBeDefined();
            expect(ticketWithBox?.GameBox?.id).toBe(gameBox.id);
        });
    });

    describe("GameBox Model", () => {
        it("should create new box with correct initial values", () => {
            const boxData = GameBox.createNewBox();

            expect(boxData.total_tickets).toBe(500);
            expect(boxData.remaining_tickets).toBe(500);
            expect(boxData.winners_remaining).toEqual({
                100: 1,
                50: 3,
                20: 8,
                10: 20,
                5: 35,
                2: 75,
            });
        });

        it("should track remaining tickets", async () => {
            const gameBox = await GameBox.create(GameBox.createNewBox());

            expect(gameBox.hasTicketsRemaining()).toBe(true);

            await gameBox.useTicket();
            expect(gameBox.remaining_tickets).toBe(499);
            expect(gameBox.hasTicketsRemaining()).toBe(true);

            gameBox.remaining_tickets = 1;
            await gameBox.save();

            await gameBox.useTicket();
            expect(gameBox.remaining_tickets).toBe(0);
            expect(gameBox.hasTicketsRemaining()).toBe(false);
            expect(gameBox.completed_at).toBeDefined();
        });

        it("should track remaining winners", async () => {
            const gameBox = await GameBox.create(GameBox.createNewBox());

            expect(gameBox.hasWinnersRemaining()).toBe(true);

            await gameBox.useWinner(100);
            expect(gameBox.winners_remaining[100]).toBe(0);

            await gameBox.useWinner(50);
            await gameBox.useWinner(50);
            await gameBox.useWinner(50);
            expect(gameBox.winners_remaining[50]).toBe(0);

            // Should not go negative
            await gameBox.useWinner(100);
            expect(gameBox.winners_remaining[100]).toBe(0);
        });
    });

    describe("UserStatistics Methods", () => {
        it("should update statistics after ticket", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            const stats = await UserStatistics.create({
                user_id: user.id,
                tickets_played: 5,
                total_winnings: 50,
                biggest_win: 20,
                sessions_played: 2,
            });

            await stats.updateAfterTicket(100);

            expect(stats.tickets_played).toBe(6);
            expect(stats.total_winnings).toBe(150);
            expect(stats.biggest_win).toBe(100);
            expect(stats.last_played).toBeDefined();
        });

        it("should increment session count", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            const stats = await UserStatistics.create({
                user_id: user.id,
                tickets_played: 0,
                total_winnings: 0,
                biggest_win: 0,
                sessions_played: 5,
            });

            await stats.incrementSession();
            expect(stats.sessions_played).toBe(6);
        });
    });
});
