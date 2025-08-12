import { Request, Response } from "express";
import { UserStatistics } from "../models/UserStatistics";
import { User } from "../models/User";
import { Ticket } from "../models/Ticket";
import { GameBoxService } from "../services/gameBox.service";
import { Op } from "sequelize";
import "../models/associations";

/**
 * Controller for statistics endpoints
 */
export class StatsController {
    /**
     * GET /api/stats
     * Get user statistics
     */
    public static async getUserStats(req: Request, res: Response): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const stats = await UserStatistics.findOne({
                where: { user_id: req.userId },
            });

            if (!stats) {
                res.status(404).json({ error: "Statistics not found" });
                return;
            }

            // Calculate win rate
            const winningTickets = await Ticket.count({
                where: {
                    user_id: req.userId,
                    is_winner: true,
                },
            });

            const winRate =
                stats.tickets_played > 0 ? (winningTickets / stats.tickets_played) * 100 : 0;

            // Calculate net profit/loss
            const totalSpent = stats.tickets_played; // Each ticket costs $1
            const netProfit = Number(stats.total_winnings) - totalSpent;

            res.json({
                statistics: {
                    ticketsPlayed: stats.tickets_played,
                    totalWinnings: stats.total_winnings,
                    biggestWin: stats.biggest_win,
                    sessionsPlayed: stats.sessions_played,
                    lastPlayed: stats.last_played,
                    winRate: Math.round(winRate * 100) / 100,
                    winningTickets,
                    losingTickets: stats.tickets_played - winningTickets,
                    totalSpent,
                    netProfit,
                    averageWin:
                        winningTickets > 0
                            ? Math.round((Number(stats.total_winnings) / winningTickets) * 100) /
                              100
                            : 0,
                },
            });
        } catch (error) {
            console.error("Error fetching user statistics:", error);
            res.status(500).json({ error: "Failed to fetch statistics" });
        }
    }

    /**
     * GET /api/stats/session
     * Get current session statistics
     */
    public static async getSessionStats(req: Request, res: Response): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            // Get tickets from the last 24 hours (session)
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const sessionTickets = await Ticket.findAll({
                where: {
                    user_id: req.userId,
                    created_at: {
                        [Op.gte]: twentyFourHoursAgo,
                    },
                },
            });

            const sessionStats = {
                ticketsPlayed: sessionTickets.length,
                winningTickets: sessionTickets.filter((t) => t.is_winner).length,
                totalWinnings: sessionTickets.reduce((sum, t) => sum + Number(t.total_payout), 0),
                biggestWin: Math.max(0, ...sessionTickets.map((t) => Number(t.total_payout))),
                netProfit: 0,
            };

            sessionStats.netProfit = sessionStats.totalWinnings - sessionStats.ticketsPlayed;

            res.json({
                sessionStatistics: {
                    ...sessionStats,
                    winRate:
                        sessionStats.ticketsPlayed > 0
                            ? Math.round(
                                  (sessionStats.winningTickets / sessionStats.ticketsPlayed) * 10000
                              ) / 100
                            : 0,
                },
            });
        } catch (error) {
            console.error("Error fetching session statistics:", error);
            res.status(500).json({ error: "Failed to fetch session statistics" });
        }
    }

    /**
     * GET /api/gamebox/current
     * Get current game box status
     */
    public static async getCurrentGameBox(_req: Request, res: Response): Promise<void> {
        try {
            const gameBox = await GameBoxService.getCurrentBox();
            const stats = await GameBoxService.getBoxStatistics(gameBox);

            res.json({
                gameBox: {
                    id: gameBox.id,
                    ...stats,
                    createdAt: gameBox.created_at,
                    completedAt: gameBox.completed_at,
                },
            });
        } catch (error) {
            console.error("Error fetching game box:", error);
            res.status(500).json({ error: "Failed to fetch game box status" });
        }
    }

    /**
     * GET /api/stats/leaderboard
     * Get top players (optional endpoint)
     */
    public static async getLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const metric = (req.query.metric as string) || "total_winnings";

            if (!["total_winnings", "biggest_win", "tickets_played"].includes(metric)) {
                res.status(400).json({ error: "Invalid metric" });
                return;
            }

            const topPlayers = await UserStatistics.findAll({
                order: [[metric, "DESC"]],
                limit,
                attributes: ["user_id", metric, "tickets_played", "total_winnings"],
                include: [
                    {
                        model: User,
                        attributes: ["username"],
                    },
                ],
            });

            res.json({
                leaderboard: topPlayers.map((stat, index) => ({
                    rank: index + 1,
                    username: stat.User?.username || "Anonymous",
                    value: stat[metric as keyof UserStatistics],
                    ticketsPlayed: stat.tickets_played,
                    totalWinnings: stat.total_winnings,
                })),
                metric,
            });
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            res.status(500).json({ error: "Failed to fetch leaderboard" });
        }
    }
}
