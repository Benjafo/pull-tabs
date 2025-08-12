import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";

/**
 * Controller for ticket-related endpoints
 */
export class TicketController {
    /**
     * POST /api/tickets/purchase
     * Purchase a new ticket
     */
    public static async purchaseTicket(req: Request, res: Response): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const ticket = await TicketService.purchaseTicket(req.userId);

            // Return ticket without revealing symbols initially
            res.status(201).json({
                message: "Ticket purchased successfully",
                ticket: {
                    id: ticket.id,
                    gameBoxId: ticket.game_box_id,
                    createdAt: ticket.created_at,
                    // Don't reveal symbols, winning status, or payout until tabs are revealed
                },
            });
        } catch (error) {
            console.error("Error purchasing ticket:", error);
<<<<<<< HEAD
            res.status(500).json({ error: "Failed to purchase ticket" });
=======
            if (error instanceof Error) {
                if (error.message.includes("No game box available")) {
                    res.status(503).json({ error: "No game box available. Please try again later." });
                } else if (error.message.includes("Insufficient tickets")) {
                    res.status(409).json({ error: "No tickets remaining in current game box" });
                } else {
                    res.status(500).json({ error: "Failed to purchase ticket", details: error.message });
                }
            } else {
                res.status(500).json({ error: "Failed to purchase ticket" });
            }
>>>>>>> 19b5c1f (task: modify server/src/__tests__/integration/gameFlow.test.ts - 17:51,modify server/src/__tests__/integration/gameFlow.test.ts - 17:45,modify server/src/__tests__/integration/gameFlow.test.ts - 17:45, - 2025-08-12)
        }
    }

    /**
     * GET /api/tickets/:id
     * Get ticket details
     */
    public static async getTicket(req: Request, res: Response): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const ticketId = parseInt(req.params.id);
            if (isNaN(ticketId)) {
                res.status(400).json({ error: "Invalid ticket ID" });
                return;
            }

            const result = await TicketService.getTicketWithRevealState(ticketId, req.userId);

            res.json({
                ticket: {
                    id: result.ticket.id,
                    gameBoxId: result.ticket.game_box_id,
                    createdAt: result.ticket.created_at,
                    revealedTabs: result.revealedTabs,
                    isFullyRevealed: result.isFullyRevealed,
                    // Only show full details if fully revealed
                    ...(result.isFullyRevealed && {
                        symbols: result.ticket.symbols,
                        winningLines: result.ticket.winning_lines,
                        totalPayout: result.ticket.total_payout,
                        isWinner: result.ticket.is_winner,
                    }),
                },
            });
        } catch (error) {
            console.error("Error fetching ticket:", error);
            if (error instanceof Error && error.message === "Ticket not found") {
                res.status(404).json({ error: "Ticket not found" });
            } else {
                res.status(500).json({ error: "Failed to fetch ticket" });
            }
        }
    }

    /**
     * POST /api/tickets/:id/reveal
     * Reveal a tab on a ticket
     */
    public static async revealTab(req: Request, res: Response): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const ticketId = parseInt(req.params.id);
            const { tabIndex } = req.body;

            if (isNaN(ticketId)) {
                res.status(400).json({ error: "Invalid ticket ID" });
                return;
            }

            if (typeof tabIndex !== "number" || tabIndex < 0 || tabIndex > 4) {
                res.status(400).json({ error: "Invalid tab index (must be 0-4)" });
                return;
            }

            const result = await TicketService.revealTab(ticketId, req.userId, tabIndex);
            
            // Get updated ticket state
            const ticketState = await TicketService.getTicketWithRevealState(ticketId, req.userId);

            res.json({
                message: `Tab ${tabIndex + 1} revealed`,
                tab: {
                    index: tabIndex,
                    symbols: result.symbols,
                    winDetected: result.winDetected,
                },
                ticket: {
                    id: ticketState.ticket.id,
                    revealedTabs: ticketState.revealedTabs,
                    isFullyRevealed: ticketState.isFullyRevealed,
                    // Only show full details if fully revealed
                    ...(ticketState.isFullyRevealed && {
                        symbols: ticketState.ticket.symbols,
                        winningLines: ticketState.ticket.winning_lines,
                        totalPayout: ticketState.ticket.total_payout,
                        isWinner: ticketState.ticket.is_winner,
                    }),
                },
                // Only show total payout if a win was detected
                ...(result.winDetected && {
                    totalPayout: result.totalPayout,
                }),
            });
        } catch (error) {
            console.error("Error revealing tab:", error);
            if (error instanceof Error && error.message === "Ticket not found") {
                res.status(404).json({ error: "Ticket not found" });
            } else if (error instanceof Error && error.message === "Invalid tab index") {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Failed to reveal tab" });
            }
        }
    }

    /**
     * GET /api/tickets
     * Get user's ticket history
     */
    public static async getUserTickets(req: Request, res: Response): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;

            if (limit < 1 || limit > 100) {
                res.status(400).json({ error: "Limit must be between 1 and 100" });
                return;
            }

            const result = await TicketService.getUserTickets(req.userId, limit, offset);

            res.json({
                tickets: result.tickets.map((ticket) => ({
                    id: ticket.id,
                    gameBoxId: ticket.game_box_id,
                    totalPayout: ticket.total_payout,
                    isWinner: ticket.is_winner,
                    createdAt: ticket.created_at,
                })),
                total: result.total,
                limit,
                offset,
            });
        } catch (error) {
            console.error("Error fetching user tickets:", error);
            res.status(500).json({ error: "Failed to fetch tickets" });
        }
    }
}
