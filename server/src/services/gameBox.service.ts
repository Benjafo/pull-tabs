import { GameBox } from "../models/GameBox";
import { Op } from "sequelize";

/**
 * Service for managing game boxes
 */
export class GameBoxService {
    /**
     * Get the current active game box or create a new one
     */
    public static async getCurrentBox(): Promise<GameBox> {
        // Find an incomplete box with tickets remaining
        let currentBox = await GameBox.findOne({
            where: {
                completed_at: null,
                remaining_tickets: {
                    [Op.gt]: 0,
                },
            },
            order: [["created_at", "DESC"]],
        });

        // If no active box exists, create a new one
        if (!currentBox) {
            currentBox = await GameBox.create(GameBox.createNewBox());
        }

        return currentBox;
    }

    /**
     * Check if we need to select a winner based on remaining distribution
     */
    public static shouldGenerateWinner(gameBox: GameBox): boolean {
        if (!gameBox.hasWinnersRemaining()) {
            return false;
        }

        // Calculate the probability of generating a winner
        // Based on remaining winners vs remaining tickets
        const totalWinnersRemaining = Object.values(gameBox.winners_remaining).reduce(
            (sum, count) => sum + count,
            0
        );

        if (totalWinnersRemaining === 0) {
            return false;
        }

        // If we're running low on tickets, ensure all winners are distributed
        if (gameBox.remaining_tickets <= totalWinnersRemaining) {
            return true;
        }

        // Random selection weighted by remaining distribution
        const winProbability = totalWinnersRemaining / gameBox.remaining_tickets;
        return Math.random() < winProbability;
    }

    /**
     * Select a prize level based on remaining winners
     */
    public static selectPrizeLevel(gameBox: GameBox): number | null {
        const winners = gameBox.winners_remaining;
        const availablePrizes: number[] = [];

        // Build array of available prizes
        Object.entries(winners).forEach(([prize, count]) => {
            const prizeValue = parseInt(prize);
            for (let i = 0; i < count; i++) {
                availablePrizes.push(prizeValue);
            }
        });

        if (availablePrizes.length === 0) {
            return null;
        }

        // Randomly select from available prizes
        const randomIndex = Math.floor(Math.random() * availablePrizes.length);
        return availablePrizes[randomIndex];
    }

    /**
     * Mark a ticket as used and update winner counts if needed
     */
    public static async useTicket(gameBox: GameBox, prizeAmount: number | null): Promise<void> {
        // Decrement ticket count
        await gameBox.useTicket();

        // If this was a winner, decrement the winner count
        if (prizeAmount !== null && prizeAmount > 0) {
            await gameBox.useWinner(prizeAmount as keyof typeof gameBox.winners_remaining);
        }
    }

    /**
     * Get statistics for the current game box
     */
    public static async getBoxStatistics(gameBox: GameBox): Promise<{
        totalTickets: number;
        remainingTickets: number;
        soldTickets: number;
        percentSold: number;
        winnersRemaining: typeof gameBox.winners_remaining;
        totalWinnersRemaining: number;
        isComplete: boolean;
    }> {
        const soldTickets = gameBox.total_tickets - gameBox.remaining_tickets;
        const percentSold = (soldTickets / gameBox.total_tickets) * 100;
        const totalWinnersRemaining = Object.values(gameBox.winners_remaining).reduce(
            (sum, count) => sum + count,
            0
        );

        return {
            totalTickets: gameBox.total_tickets,
            remainingTickets: gameBox.remaining_tickets,
            soldTickets,
            percentSold: Math.round(percentSold * 100) / 100,
            winnersRemaining: gameBox.winners_remaining,
            totalWinnersRemaining,
            isComplete: gameBox.completed_at !== null,
        };
    }
}
