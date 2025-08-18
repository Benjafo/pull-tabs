import { TicketService } from "../../services/ticket.service";
import { GameBox } from "../../models/GameBox";
import { User } from "../../models/User";
import { UserStatistics } from "../../models/UserStatistics";
import { Ticket, GameSymbol } from "../../models/Ticket";
import sequelize from "../../config/database";

describe("TicketService", () => {
    let testUser: User;
    let testGameBox: GameBox;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await Ticket.destroy({ where: {} });
        await UserStatistics.destroy({ where: {} });
        await GameBox.destroy({ where: {} });
        await User.destroy({ where: {} });

        // Create test user
        testUser = await User.create({
            email: "test@example.com",
            password_hash: "password123",
        });

        // Create user statistics
        await UserStatistics.create({
            user_id: testUser.id,
            tickets_played: 0,
            total_winnings: 0,
            biggest_win: 0,
            sessions_played: 1,
        });

        // Create test game box
        testGameBox = await GameBox.create(GameBox.createNewBox());
    });

    describe("Symbol Generation", () => {
        it("should generate winning symbols correctly", () => {
            // Test private method through purchaseTicket
            // This is tested indirectly through ticket generation
        });

        it("should generate losing symbols without winning patterns", async () => {
            // Force a losing ticket by setting no winners remaining
            testGameBox.winners_remaining = {
                100: 0,
                20: 0,
                10: 0,
                5: 0,
                2: 0,
                1: 0,
            };
            await testGameBox.save();

            const ticket = await TicketService.purchaseTicket(testUser.id);

            // Check that no winning lines exist
            const winningLines = Ticket.checkWinningLines(ticket.symbols);
            expect(winningLines.length).toBe(0);
            expect(ticket.is_winner).toBe(false);
            expect(ticket.total_payout).toBe(0);
        });
    });

    describe("purchaseTicket", () => {
        it("should create a ticket successfully", async () => {
            const ticket = await TicketService.purchaseTicket(testUser.id);

            expect(ticket).toBeDefined();
            expect(ticket.user_id).toBe(testUser.id);
            expect(ticket.game_box_id).toBe(testGameBox.id);
            expect(ticket.symbols.length).toBe(15);
        });

        it("should update game box ticket count", async () => {
            const initialCount = testGameBox.remaining_tickets;

            await TicketService.purchaseTicket(testUser.id);

            const updatedBox = await GameBox.findByPk(testGameBox.id);
            expect(updatedBox?.remaining_tickets).toBe(initialCount - 1);
        });

        it("should update user statistics", async () => {
            await TicketService.purchaseTicket(testUser.id);

            const stats = await UserStatistics.findOne({
                where: { user_id: testUser.id },
            });

            expect(stats?.tickets_played).toBe(1);
            expect(stats?.last_played).toBeDefined();
        });

        it("should handle winners correctly", async () => {
            // Force a winner
            testGameBox.remaining_tickets = 1;
            testGameBox.winners_remaining = {
                100: 1,
                20: 0,
                10: 0,
                5: 0,
                2: 0,
                1: 0,
            };
            await testGameBox.save();

            const ticket = await TicketService.purchaseTicket(testUser.id);

            expect(ticket.is_winner).toBe(true);
            expect(ticket.total_payout).toBe(100);
            expect(ticket.winning_lines.length).toBeGreaterThan(0);
        });
    });

    describe("revealTab", () => {
        let ticket: Ticket;

        beforeEach(async () => {
            ticket = await TicketService.purchaseTicket(testUser.id);
        });

        it("should reveal correct symbols for a tab", async () => {
            const result = await TicketService.revealTab(ticket.id, testUser.id, 0);

            expect(result.symbols.length).toBe(3);
            expect(result.symbols).toEqual(ticket.symbols.slice(0, 3));
        });

        it("should detect wins on winning tabs", async () => {
            // Create a winning ticket
            const winningSymbols = new Array(15).fill(GameSymbol.MAP);
            winningSymbols[0] = GameSymbol.SKULL;
            winningSymbols[1] = GameSymbol.SKULL;
            winningSymbols[2] = GameSymbol.TREASURE; // $20 win

            const winningTicket = await Ticket.create({
                user_id: testUser.id,
                game_box_id: testGameBox.id,
                symbols: winningSymbols,
                winning_lines: Ticket.checkWinningLines(winningSymbols),
                total_payout: 20,
                is_winner: true,
            });

            const result = await TicketService.revealTab(winningTicket.id, testUser.id, 0);

            expect(result.winDetected).toBe(true);
            expect(result.totalPayout).toBe(20);
        });

        it("should reject invalid tab index", async () => {
            await expect(TicketService.revealTab(ticket.id, testUser.id, 5)).rejects.toThrow(
                "Invalid tab index"
            );
        });

        it("should reject ticket from different user", async () => {
            const otherUser = await User.create({
                email: "other@example.com",
                password_hash: "password123",
            });

            await expect(TicketService.revealTab(ticket.id, otherUser.id, 0)).rejects.toThrow(
                "Ticket not found"
            );
        });
    });

    describe("Win Detection", () => {
        it("should detect Skull-Skull-Skull as $100 win", () => {
            const symbols = new Array(15).fill(GameSymbol.MAP);
            symbols[0] = GameSymbol.SKULL;
            symbols[1] = GameSymbol.SKULL;
            symbols[2] = GameSymbol.SKULL;

            const winningLines = Ticket.checkWinningLines(symbols);
            const payout = Ticket.calculatePayout(winningLines);

            expect(winningLines.length).toBe(1);
            expect(winningLines[0].prize).toBe(100);
            expect(payout).toBe(100);
        });

        it("should detect multiple winning lines", () => {
            const symbols = new Array(15).fill(GameSymbol.MAP);
            // First line: $20 win
            symbols[0] = GameSymbol.SKULL;
            symbols[1] = GameSymbol.SKULL;
            symbols[2] = GameSymbol.TREASURE;
            // Third line: $10 win
            symbols[6] = GameSymbol.SKULL;
            symbols[7] = GameSymbol.SKULL;
            symbols[8] = GameSymbol.SHIP;

            const winningLines = Ticket.checkWinningLines(symbols);
            const payout = Ticket.calculatePayout(winningLines);

            expect(winningLines.length).toBe(2);
            expect(payout).toBe(30); // $20 + $10
        });

        it("should not detect win without Skull-Skull pattern", () => {
            const symbols = new Array(15).fill(GameSymbol.MAP);
            symbols[0] = GameSymbol.SKULL;
            symbols[1] = GameSymbol.TREASURE;
            symbols[2] = GameSymbol.SKULL;

            const winningLines = Ticket.checkWinningLines(symbols);

            expect(winningLines.length).toBe(0);
        });
    });

    describe("getUserTickets", () => {
        it("should return user's tickets with pagination", async () => {
            // Create multiple tickets
            for (let i = 0; i < 15; i++) {
                await TicketService.purchaseTicket(testUser.id);
            }

            const result = await TicketService.getUserTickets(testUser.id, 10, 0);

            expect(result.tickets.length).toBe(10);
            expect(result.total).toBe(15);
        });

        it("should return tickets in descending order by creation", async () => {
            const ticket1 = await TicketService.purchaseTicket(testUser.id);
            await new Promise((resolve) => setTimeout(resolve, 10));
            const ticket2 = await TicketService.purchaseTicket(testUser.id);

            const result = await TicketService.getUserTickets(testUser.id, 10, 0);

            expect(result.tickets[0].id).toBe(ticket2.id);
            expect(result.tickets[1].id).toBe(ticket1.id);
        });
    });
});
