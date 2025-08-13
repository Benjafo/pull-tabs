import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { UserStats } from "../services/statsService";
import statsService from "../services/statsService";

export function StatsPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const userStats = await statsService.getUserStats();
            setStats(userStats);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="stats-page loading">
                <div className="spinner">Loading statistics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stats-page error">
                <div className="error-message">
                    <h2>Error Loading Statistics</h2>
                    <p>{error}</p>
                    <button onClick={loadStats}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="stats-page">
            <div className="stats-container">
                <h1>Player Statistics</h1>
                <div className="player-info">
                    <h2>{user?.email}'s Performance</h2>
                </div>

                {stats && (
                    <div className="stats-dashboard">
                        <div className="stat-card primary">
                            <div className="stat-icon">🎫</div>
                            <div className="stat-content">
                                <h3>Tickets Played</h3>
                                <p className="stat-number">{stats.ticketsPlayed}</p>
                            </div>
                        </div>

                        <div className="stat-card success">
                            <div className="stat-icon">💰</div>
                            <div className="stat-content">
                                <h3>Total Winnings</h3>
                                <p className="stat-number">
                                    ${stats.totalWinnings.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card highlight">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-content">
                                <h3>Biggest Win</h3>
                                <p className="stat-number">
                                    ${stats.biggestWin.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card info">
                            <div className="stat-icon">📊</div>
                            <div className="stat-content">
                                <h3>Win Rate</h3>
                                <p className="stat-number">
                                    {stats.winRate.toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🎮</div>
                            <div className="stat-content">
                                <h3>Sessions Played</h3>
                                <p className="stat-number">{stats.sessionsPlayed}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📅</div>
                            <div className="stat-content">
                                <h3>Last Played</h3>
                                <p className="stat-number">
                                    {stats.lastPlayed
                                        ? new Date(stats.lastPlayed).toLocaleDateString()
                                        : "Never"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="stats-summary">
                    {stats && stats.ticketsPlayed > 0 && (
                        <>
                            <h3>Performance Summary</h3>
                            <p>
                                You've spent ${stats.ticketsPlayed.toFixed(2)} and won $
                                {stats.totalWinnings.toFixed(2)}, giving you a net{" "}
                                {stats.totalWinnings - stats.ticketsPlayed >= 0 ? "profit" : "loss"}{" "}
                                of ${Math.abs(stats.totalWinnings - stats.ticketsPlayed).toFixed(2)}
                                .
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
