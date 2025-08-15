import { Ticket, GameSymbol, WinningLine } from "../models/Ticket";
import { UserStatistics } from "../models/UserStatistics";
import { GameBoxService } from "./gameBox.service";
import { GameBox } from "../models/GameBox";
import sequelize from "../config/database";
import { Op } from "sequelize";

/**
 * Service for generating and managing tickets
 */
export class TicketService {
    /**
     * Generate a random symbol (excluding skull for non-winning positions)
     */
    private static getRandomNonSkullSymbol(): GameSymbol {
        const symbols = [
            GameSymbol.TREASURE,
            GameSymbol.SHIP,
            GameSymbol.ANCHOR,
            GameSymbol.COMPASS,
            GameSymbol.MAP,
        ];
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    /**
     * Generate a random symbol (including skull)
     */
    private static getRandomSymbol(): GameSymbol {
        const symbols = Object.values(GameSymbol).filter(
            (val) => typeof val === "number"
        ) as GameSymbol[];
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    /**
     * Generate symbols for a winning ticket
     */
    private static generateWinningSymbols(prizeAmount: number): GameSymbol[] {
        const symbols: GameSymbol[] = new Array(15);

        // Map prize amount to third symbol
        let thirdSymbol: GameSymbol;
        switch (prizeAmount) {
            case 100:
                thirdSymbol = GameSymbol.SKULL;
                break;
            case 50:
                thirdSymbol = GameSymbol.TREASURE;
                break;
            case 20:
                thirdSymbol = GameSymbol.SHIP;
                break;
            case 10:
                thirdSymbol = GameSymbol.ANCHOR;
                break;
            case 5:
                thirdSymbol = GameSymbol.COMPASS;
                break;
            case 2:
                thirdSymbol = GameSymbol.MAP;
                break;
            default:
                throw new Error(`Invalid prize amount: ${prizeAmount}`);
        }

        // Randomly select which line (0-4) will be the winning line
        const winningLineIndex = Math.floor(Math.random() * 5);
        const winningPositions = [
            winningLineIndex * 3,
            winningLineIndex * 3 + 1,
            winningLineIndex * 3 + 2,
        ];

        // Set the winning pattern (Skull-Skull-X)
        symbols[winningPositions[0]] = GameSymbol.SKULL;
        symbols[winningPositions[1]] = GameSymbol.SKULL;
        symbols[winningPositions[2]] = thirdSymbol;

        // Fill remaining positions with random symbols
        // Ensure no accidental winning patterns
        for (let i = 0; i < 15; i++) {
            if (symbols[i] === undefined) {
                // For positions that could create winning patterns, avoid skulls
                const lineStart = Math.floor(i / 3) * 3;
                const positionInLine = i % 3;

                if (positionInLine === 0 || positionInLine === 1) {
                    // First or second position in a line
                    // Check if the other position is already a skull
                    const otherPos = positionInLine === 0 ? lineStart + 1 : lineStart;
                    if (symbols[otherPos] === GameSymbol.SKULL) {
                        // Avoid creating another winning pattern
                        symbols[i] = this.getRandomNonSkullSymbol();
                    } else {
                        symbols[i] = this.getRandomSymbol();
                    }
                } else {
                    // Third position - safe to use any symbol
                    symbols[i] = this.getRandomSymbol();
                }
            }
        }

        return symbols;
    }

    /**
     * Generate symbols for a losing ticket
     */
    private static generateLosingSymbols(): GameSymbol[] {
        const symbols: GameSymbol[] = new Array(15);

        for (let i = 0; i < 15; i++) {
            const lineStart = Math.floor(i / 3) * 3;
            const positionInLine = i % 3;

            if (positionInLine === 0) {
                // First position - can be any symbol
                symbols[i] = this.getRandomSymbol();
            } else if (positionInLine === 1) {
                // Second position - if first is skull, avoid skull
                if (symbols[lineStart] === GameSymbol.SKULL) {
                    symbols[i] = this.getRandomNonSkullSymbol();
                } else {
                    symbols[i] = this.getRandomSymbol();
                }
            } else {
                // Third position - can be any symbol since we've prevented Skull-Skull
                symbols[i] = this.getRandomSymbol();
            }
        }

        return symbols;
    }

    /**
     * Purchase a new ticket for a user
     */
    public static async purchaseTicket(userId: number): Promise<Ticket> {
        const transaction = await sequelize.transaction();

        try {
            // Get current game box with lock to prevent concurrent updates
            let gameBox = await GameBox.findOne({
                where: {
                    completed_at: null,
                    remaining_tickets: {
                        [Op.gt]: 0,
                    },
                },
                order: [["created_at", "DESC"]],
                lock: transaction.LOCK.UPDATE,
                transaction,
            });

            // If no active box exists, create a new one
            if (!gameBox) {
                gameBox = await GameBox.create(GameBox.createNewBox(), { transaction });
            }

            // Verify we have tickets available
            if (gameBox.remaining_tickets <= 0) {
                throw new Error("Insufficient tickets in current game box");
            }

            // Determine if this should be a winner
            const shouldWin = GameBoxService.shouldGenerateWinner(gameBox);
            let symbols: GameSymbol[];
            let prizeAmount: number | null = null;
            let winningLines: WinningLine[] = [];
            let totalPayout = 0;

            if (shouldWin) {
                // Select prize level based on remaining winners
                prizeAmount = GameBoxService.selectPrizeLevel(gameBox);
                if (prizeAmount !== null) {
                    symbols = this.generateWinningSymbols(prizeAmount);
                    // Check the generated winning lines to ensure they match
                    winningLines = Ticket.checkWinningLines(symbols);
                    // Verify we actually generated a winner
                    const calculatedPayout = Ticket.calculatePayout(winningLines);
                    if (calculatedPayout > 0) {
                        totalPayout = calculatedPayout; // Use actual calculated payout
                    } else {
                        // Fallback if pattern detection failed
                        console.error("Warning: Generated winning symbols but no payout detected");
                        totalPayout = prizeAmount;
                    }
                } else {
                    // No winners left, generate losing ticket
                    symbols = this.generateLosingSymbols();
                    winningLines = Ticket.checkWinningLines(symbols);
                    totalPayout = Ticket.calculatePayout(winningLines);
                }
            } else {
                // Generate losing ticket
                symbols = this.generateLosingSymbols();
                winningLines = Ticket.checkWinningLines(symbols);
                totalPayout = Ticket.calculatePayout(winningLines);
            }

            // Create the ticket
            const ticket = await Ticket.create(
                {
                    user_id: userId,
                    game_box_id: gameBox.id,
                    symbols,
                    winning_lines: winningLines,
                    total_payout: totalPayout,
                    is_winner: totalPayout > 0,
                },
                { transaction }
            );

            // Update game box - decrement ticket count
            await gameBox.useTicket(transaction);

            // If this was a winner, decrement the winner count
            if (totalPayout > 0) {
                await gameBox.useWinner(
                    totalPayout as keyof typeof gameBox.winners_remaining,
                    transaction
                );
            }

            // Update user statistics
            const userStats = await UserStatistics.findOne({
                where: { user_id: userId },
                transaction,
            });

            if (userStats) {
                await userStats.updateAfterTicket(totalPayout);
            }

            await transaction.commit();
            return ticket;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Get ticket details with reveal state
     */
    public static async getTicketWithRevealState(
        ticketId: number,
        userId: number
    ): Promise<{
        ticket: Ticket;
        revealedTabs: boolean[];
        isFullyRevealed: boolean;
    }> {
        const ticket = await Ticket.findOne({
            where: {
                id: ticketId,
                user_id: userId,
            },
        });

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // Get revealed tabs from the ticket
        const revealedTabIndices = ticket.revealed_tabs || [];
        const revealedTabs = [0, 1, 2, 3, 4].map((i) => revealedTabIndices.includes(i));
        const isFullyRevealed = revealedTabs.every((tab) => tab);

        return {
            ticket,
            revealedTabs,
            isFullyRevealed,
        };
    }

    /**
     * Reveal a specific tab on a ticket
     */
    public static async revealTab(
        ticketId: number,
        userId: number,
        tabIndex: number
    ): Promise<{
        symbols: GameSymbol[];
        winDetected: boolean;
        totalPayout: number;
    }> {
        if (tabIndex < 0 || tabIndex > 4) {
            throw new Error("Invalid tab index");
        }

        const ticket = await Ticket.findOne({
            where: {
                id: ticketId,
                user_id: userId,
            },
        });

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // Update revealed tabs if not already revealed
        const revealedTabs = ticket.revealed_tabs || [];
        if (!revealedTabs.includes(tabIndex)) {
            revealedTabs.push(tabIndex);
            // Force array update for PostgreSQL
            ticket.revealed_tabs = revealedTabs;
            ticket.changed("revealed_tabs", true);
            await ticket.save();
        }

        // Get the symbols for this tab (3 symbols per tab)
        const startIndex = tabIndex * 3;
        const tabSymbols = ticket.symbols.slice(startIndex, startIndex + 3);

        // Check if this tab contains a winning line
        const winDetected =
            ticket.winning_lines.some((line) => line.line === tabIndex + 1) || false;

        return {
            symbols: tabSymbols,
            winDetected,
            totalPayout: Number(ticket.total_payout),
        };
    }

    /**
     * Get user's ticket history
     */
    public static async getUserTickets(
        userId: number,
        limit: number = 10,
        offset: number = 0
    ): Promise<{
        tickets: Ticket[];
        total: number;
    }> {
        const { count, rows } = await Ticket.findAndCountAll({
            where: { user_id: userId },
            order: [["created_at", "DESC"]],
            limit,
            offset,
        });

        return {
            tickets: rows,
            total: count,
        };
    }
}
