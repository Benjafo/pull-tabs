import sequelize from "../../config/database";
import { GameBox, User } from "../../models";
import { TicketService } from "../../services/ticket.service";

describe("Box Payout Verification Tests", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe("Complete Box Win Rate Verification", () => {
        it("should match predetermined payout rates when playing entire box", async () => {
            // Create a fresh game box
            const gameBox = await GameBox.create(GameBox.createNewBox());

            // Create a test user for purchasing tickets
            const user = await User.create({
                email: "test@example.com",
                password_hash: "dummy_hash",
            });

            // Expected distribution from GameBox.createNewBox()
            const expectedDistribution = {
                100: 1,
                20: 2,
                10: 5,
                5: 5,
                2: 48,
                1: 65,
            };

            // Track actual wins
            const actualWins: { [key: number]: number } = {
                100: 0,
                20: 0,
                10: 0,
                5: 0,
                2: 0,
                1: 0,
            };

            const ticketResults: Array<{
                ticketNumber: number;
                payout: number;
                isWinner: boolean;
            }> = [];

            // Play through the entire box (500 tickets)
            // console.log("Starting to play through entire box of 500 tickets...");

            for (let i = 0; i < 500; i++) {
                try {
                    const ticket = await TicketService.purchaseTicket(user.id);

                    ticketResults.push({
                        ticketNumber: i + 1,
                        payout: ticket.total_payout,
                        isWinner: ticket.is_winner,
                    });

                    // Track wins by amount
                    if (ticket.is_winner && ticket.total_payout > 0) {
                        actualWins[ticket.total_payout] =
                            (actualWins[ticket.total_payout] || 0) + 1;
                    }

                    // Log progress every 50 tickets
                    // if ((i + 1) % 50 === 0) {
                    //     console.log(`Processed ${i + 1}/500 tickets`);
                    // }
                } catch (error) {
                    console.error(`Error purchasing ticket ${i + 1}:`, error);
                    throw error;
                }
            }

            // Verify the box is now complete
            const updatedBox = await GameBox.findByPk(gameBox.id);
            expect(updatedBox?.remaining_tickets).toBe(0);
            expect(updatedBox?.completed_at).not.toBeNull();

            // Log results
            // console.log("\n=== BOX PAYOUT VERIFICATION RESULTS ===");
            // console.log("\nExpected vs Actual Distribution:");
            // console.log("Prize | Expected | Actual | Match");
            // console.log("------|----------|--------|-------");

            let totalExpectedWinners = 0;
            let totalActualWinners = 0;
            let totalExpectedPayout = 0;
            let totalActualPayout = 0;

            Object.entries(expectedDistribution).forEach(([prize, expectedCount]) => {
                const prizeAmount = parseInt(prize);
                const actualCount = actualWins[prizeAmount] || 0;
                // const match = expectedCount === actualCount ? "✓" : "✗";

                // console.log(
                //     `$${prize.padEnd(4)} | ${expectedCount.toString().padEnd(8)} | ${actualCount.toString().padEnd(6)} | ${match}`
                // );

                totalExpectedWinners += expectedCount;
                totalActualWinners += actualCount;
                totalExpectedPayout += prizeAmount * expectedCount;
                totalActualPayout += prizeAmount * actualCount;
            });

            // console.log("\nSummary Statistics:");
            // console.log(`Total Expected Winners: ${totalExpectedWinners}`);
            // console.log(`Total Actual Winners: ${totalActualWinners}`);
            // console.log(`Total Expected Payout: $${totalExpectedPayout}`);
            // console.log(`Total Actual Payout: $${totalActualPayout}`);
            // console.log(`Total Losing Tickets: ${500 - totalActualWinners}`);

            // Calculate win percentage
            // const winPercentage = (totalActualWinners / 500) * 100;
            // const expectedWinPercentage = (totalExpectedWinners / 500) * 100;
            // console.log(
            //     `\nWin Percentage: ${winPercentage.toFixed(2)}% (Expected: ${expectedWinPercentage.toFixed(2)}%)`
            // );

            // Calculate payout percentage (total payout / total revenue)
            // const totalRevenue = 500 * 2; // Assuming $2 per ticket
            // const payoutPercentage = (totalActualPayout / totalRevenue) * 100;
            // const expectedPayoutPercentage = (totalExpectedPayout / totalRevenue) * 100;
            // console.log(
            //     `Payout Percentage: ${payoutPercentage.toFixed(2)}% (Expected: ${expectedPayoutPercentage.toFixed(2)}%)`
            // );

            // Verify all winners remaining are depleted
            // console.log("\nGame Box Winners Remaining:");
            const winnersRemaining = updatedBox?.winners_remaining || {};
            // Object.entries(winnersRemaining).forEach(([prize, count]) => {
            //     console.log(`$${prize}: ${count}`);
            // });

            // ASSERTIONS
            // Verify exact match of winner distribution
            expect(actualWins[100]).toBe(expectedDistribution[100]);
            expect(actualWins[50]).toBe(expectedDistribution[50]);
            expect(actualWins[20]).toBe(expectedDistribution[20]);
            expect(actualWins[10]).toBe(expectedDistribution[10]);
            expect(actualWins[5]).toBe(expectedDistribution[5]);
            expect(actualWins[2]).toBe(expectedDistribution[2]);

            // Verify total winners
            expect(totalActualWinners).toBe(totalExpectedWinners);

            // Verify total payout
            expect(totalActualPayout).toBe(totalExpectedPayout);

            // Verify all winners have been distributed (none remaining)
            Object.values(winnersRemaining).forEach((count) => {
                expect(count).toBe(0);
            });

            // Log sample of winning tickets for verification
            // const winningTickets = ticketResults.filter((t) => t.isWinner);
            // console.log("\nSample of winning tickets (first 10):");
            // winningTickets.slice(0, 10).forEach((ticket) => {
            //     console.log(`  Ticket #${ticket.ticketNumber}: $${ticket.payout}`);
            // });
        }, 60000); // 60 second timeout for this test

        it("should properly distribute winners throughout the box", async () => {
            // Create a fresh game box
            await GameBox.create(GameBox.createNewBox());

            // Create a test user
            const user = await User.create({
                email: "test2@example.com",
                password_hash: "dummy_hash",
            });

            // Track when each prize tier is won
            const winDistribution: { [key: number]: number[] } = {
                100: [],
                50: [],
                20: [],
                10: [],
                5: [],
                2: [],
            };

            // Play through entire box
            for (let i = 0; i < 500; i++) {
                const ticket = await TicketService.purchaseTicket(user.id);

                if (ticket.is_winner && ticket.total_payout > 0) {
                    winDistribution[ticket.total_payout].push(i + 1);
                }
            }

            // console.log("\n=== WINNER DISTRIBUTION ANALYSIS ===");

            // Analyze distribution pattern for each prize tier
            Object.entries(winDistribution).forEach(([_prize, positions]) => {
                if (positions.length > 0) {
                    // const avgPosition = positions.reduce((a, b) => a + b, 0) / positions.length;
                    // const minPosition = Math.min(...positions);
                    // const maxPosition = Math.max(...positions);

                    // console.log(`\n$${prize} winners (${positions.length} total):`);
                    // console.log(`  Positions: ${positions.join(", ")}`);
                    // console.log(`  Average position: ${avgPosition.toFixed(1)}`);
                    // console.log(`  Range: ${minPosition} - ${maxPosition}`);

                    // For multiple winners, check they're reasonably distributed
                    if (positions.length > 1) {
                        const gaps = [];
                        for (let i = 1; i < positions.length; i++) {
                            gaps.push(positions[i] - positions[i - 1]);
                        }
                        // const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
                        // console.log(`  Average gap between wins: ${avgGap.toFixed(1)} tickets`);
                    }
                }
            });

            // Verify winners are distributed throughout the box (not all clustered)
            const allWinPositions = Object.values(winDistribution)
                .flat()
                .sort((a, b) => a - b);
            const firstQuarter = allWinPositions.filter((p) => p <= 125).length;
            const secondQuarter = allWinPositions.filter((p) => p > 125 && p <= 250).length;
            const thirdQuarter = allWinPositions.filter((p) => p > 250 && p <= 375).length;
            const fourthQuarter = allWinPositions.filter((p) => p > 375).length;

            // console.log("\n=== DISTRIBUTION BY QUARTERS ===");
            // console.log(`Tickets 1-125: ${firstQuarter} winners`);
            // console.log(`Tickets 126-250: ${secondQuarter} winners`);
            // console.log(`Tickets 251-375: ${thirdQuarter} winners`);
            // console.log(`Tickets 376-500: ${fourthQuarter} winners`);

            // Basic sanity check - winners should be somewhat distributed
            // Allow for random variation, but no quarter should have more than 50% of winners
            const totalWinners = allWinPositions.length;
            expect(firstQuarter).toBeLessThan(totalWinners * 0.5);
            expect(secondQuarter).toBeLessThan(totalWinners * 0.5);
            expect(thirdQuarter).toBeLessThan(totalWinners * 0.5);
            expect(fourthQuarter).toBeLessThan(totalWinners * 0.5);
        }, 60000);
    });
});
