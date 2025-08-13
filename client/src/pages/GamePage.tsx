import { useEffect, useState } from "react";
import type { GameBoxStatus, UserStats } from "../services/statsService";
import statsService from "../services/statsService";

export function GamePage() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [gameBox, setGameBox] = useState<GameBoxStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadGameData();
    }, []);

    const loadGameData = async () => {
        try {
            setLoading(true);
            const [userStats, boxStatus] = await Promise.all([
                statsService.getUserStats(),
                statsService.getCurrentGameBox(),
            ]);
            setStats(userStats);
            setGameBox(boxStatus);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load game data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="game-page loading">
                <div className="spinner">Loading game...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="game-page error">
                <div className="error-message">
                    <h2>Error Loading Game</h2>
                    <p>{error}</p>
                    <button onClick={loadGameData}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="game-page">
            <div className="game-container">
                <div className="game-header">
                    <h2>Pull Tabs Treasure Game</h2>
                    {gameBox && (
                        <div className="box-status">
                            <span>
                                Box Progress: {gameBox.totalTickets - gameBox.remainingTickets}/
                                {gameBox.totalTickets}
                            </span>
                            <span className="remaining">
                                ({gameBox.remainingTickets} tickets remaining)
                            </span>
                        </div>
                    )}
                </div>

                <div className="game-area">
                    <div className="ticket-placeholder">
                        <p>🎫 Ticket interface will be implemented in Phase 4</p>
                        <button className="buy-ticket-btn">Buy Ticket ($1)</button>
                    </div>
                </div>

                <div className="stats-panel">
                    <h3>Your Statistics</h3>
                    {stats && (
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-label">Tickets Played:</span>
                                <span className="stat-value">{stats.ticketsPlayed}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total Winnings:</span>
                                <span className="stat-value">
                                    ${stats.totalWinnings.toFixed(2)}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Biggest Win:</span>
                                <span className="stat-value">
                                    ${stats.biggestWin.toFixed(2)}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Win Rate:</span>
                                <span className="stat-value">
                                    {stats.winRate.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
