import sequelize from "../../config/database";
import { GameBox } from "../../models/GameBox";
import { GameBoxService } from "../../services/gameBox.service";

describe("GameBoxService", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await GameBox.destroy({ where: {} });
    });

    describe("getCurrentBox", () => {
        it("should create a new box if none exists", async () => {
            const box = await GameBoxService.getCurrentBox();

            expect(box).toBeDefined();
            expect(box.total_tickets).toBe(500);
            expect(box.remaining_tickets).toBe(500);
            expect(box.completed_at).toBeNull();
        });

        it("should return existing incomplete box", async () => {
            const firstBox = await GameBox.create(GameBox.createNewBox());
            const secondBox = await GameBoxService.getCurrentBox();

            expect(secondBox.id).toBe(firstBox.id);
        });

        it("should create new box if current is complete", async () => {
            const oldBox = await GameBox.create({
                ...GameBox.createNewBox(),
                remaining_tickets: 0,
                completed_at: new Date(),
            });

            const newBox = await GameBoxService.getCurrentBox();

            expect(newBox.id).not.toBe(oldBox.id);
            expect(newBox.remaining_tickets).toBe(500);
        });
    });

    describe("shouldGenerateWinner", () => {
        it("should return false if no winners remaining", async () => {
            const box = await GameBox.create({
                ...GameBox.createNewBox(),
                winners_remaining: {
                    100: 0,
                    20: 0,
                    10: 0,
                    5: 0,
                    2: 0,
                    1: 0,
                },
            });

            const result = GameBoxService.shouldGenerateWinner(box);
            expect(result).toBe(false);
        });

        it("should return true if tickets equal winners remaining", async () => {
            const box = await GameBox.create({
                ...GameBox.createNewBox(),
                remaining_tickets: 5,
                winners_remaining: {
                    100: 1,
                    20: 1,
                    10: 1,
                    5: 1,
                    2: 0,
                    1: 0,
                },
            });

            const result = GameBoxService.shouldGenerateWinner(box);
            expect(result).toBe(true);
        });

        it("should use probability when tickets exceed winners", async () => {
            const box = await GameBox.create({
                ...GameBox.createNewBox(),
                remaining_tickets: 100,
                winners_remaining: {
                    100: 1,
                    20: 0,
                    10: 0,
                    5: 0,
                    2: 0,
                    1: 0,
                },
            });

            // Run multiple times to test probability
            let winnerCount = 0;
            for (let i = 0; i < 1000; i++) {
                if (GameBoxService.shouldGenerateWinner(box)) {
                    winnerCount++;
                }
            }

            // Should be around 1% (1 winner out of 100 tickets)
            const winRate = winnerCount / 1000;
            expect(winRate).toBeGreaterThan(0.005);
            expect(winRate).toBeLessThan(0.015);
        });
    });

    describe("selectPrizeLevel", () => {
        it("should return null if no winners remaining", async () => {
            const box = await GameBox.create({
                ...GameBox.createNewBox(),
                winners_remaining: {
                    100: 0,
                    20: 0,
                    10: 0,
                    5: 0,
                    2: 0,
                    1: 0,
                },
            });

            const prize = GameBoxService.selectPrizeLevel(box);
            expect(prize).toBeNull();
        });

        it("should select from available prizes", async () => {
            const box = await GameBox.create({
                ...GameBox.createNewBox(),
                winners_remaining: {
                    100: 0,
                    20: 1,
                    10: 0,
                    5: 0,
                    2: 0,
                    1: 0,
                },
            });

            const selectedPrizes = new Set();
            for (let i = 0; i < 50; i++) {
                const prize = GameBoxService.selectPrizeLevel(box);
                if (prize !== null) {
                    selectedPrizes.add(prize);
                }
            }

            // Should only select 50 and 20
            expect(selectedPrizes.has(50)).toBe(true);
            expect(selectedPrizes.has(20)).toBe(true);
            expect(selectedPrizes.size).toBe(2);
        });
    });

    describe("getBoxStatistics", () => {
        it("should calculate correct statistics", async () => {
            const box = await GameBox.create({
                ...GameBox.createNewBox(),
                total_tickets: 500,
                remaining_tickets: 350,
            });

            const stats = await GameBoxService.getBoxStatistics(box);

            expect(stats.totalTickets).toBe(500);
            expect(stats.remainingTickets).toBe(350);
            expect(stats.soldTickets).toBe(150);
            expect(stats.percentSold).toBe(30);
            expect(stats.totalWinnersRemaining).toBe(142); // Sum of all winners
            expect(stats.isComplete).toBe(false);
        });
    });
});
