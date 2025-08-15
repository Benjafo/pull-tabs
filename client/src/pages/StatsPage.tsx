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
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-white text-xl animate-pulse">Loading statistics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading Statistics
                    </h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={loadStats}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-navy-600 rounded-lg shadow-lg p-6 border border-gold-600/30">
                <h1 className="text-3xl font-bold text-gold-400 mb-2">Player Statistics</h1>
                <h2 className="text-xl text-cream-100">{user?.email}'s Performance</h2>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-2">🎫</div>
                                <h3 className="text-lg font-semibold opacity-90">Tickets Played</h3>
                                <p className="text-3xl font-bold mt-2">{stats.ticketsPlayed}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-gold-600/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-2">💰</div>
                                <h3 className="text-lg font-semibold opacity-90">Total Winnings</h3>
                                <p className="text-3xl font-bold mt-2">
                                    ${stats.totalWinnings.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gold-700 rounded-lg shadow-lg p-6 text-cream-100 border border-gold-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-2">🏆</div>
                                <h3 className="text-lg font-semibold opacity-90">Biggest Win</h3>
                                <p className="text-3xl font-bold mt-2">
                                    ${stats.biggestWin.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-2">📊</div>
                                <h3 className="text-lg font-semibold opacity-90">Win Rate</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {stats.winRate.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-2">🎮</div>
                                <h3 className="text-lg font-semibold opacity-90">
                                    Sessions Played
                                </h3>
                                <p className="text-3xl font-bold mt-2">{stats.sessionsPlayed}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-navy-600 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-2">📅</div>
                                <h3 className="text-lg font-semibold opacity-90">Last Played</h3>
                                <p className="text-2xl font-bold mt-2">
                                    {stats.lastPlayed
                                        ? new Date(stats.lastPlayed).toLocaleDateString()
                                        : "Never"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Summary */}
            {stats && stats.ticketsPlayed > 0 && (
                <div className="bg-navy-600 rounded-lg shadow-lg p-6 border border-gold-600/30">
                    <h3 className="text-2xl font-bold text-gold-400 mb-4">Performance Summary</h3>
                    <div className="text-lg text-cream-100">
                        <p>
                            You've spent{" "}
                            <span className="font-bold text-gold-300">
                                ${stats.ticketsPlayed.toFixed(2)}
                            </span>{" "}
                            and won{" "}
                            <span className="font-bold text-gold-400">
                                ${stats.totalWinnings.toFixed(2)}
                            </span>
                            , giving you a net{" "}
                            <span
                                className={`font-bold ${
                                    stats.totalWinnings - stats.ticketsPlayed >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {stats.totalWinnings - stats.ticketsPlayed >= 0 ? "profit" : "loss"}
                            </span>{" "}
                            of{" "}
                            <span
                                className={`font-bold ${
                                    stats.totalWinnings - stats.ticketsPlayed >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                ${Math.abs(stats.totalWinnings - stats.ticketsPlayed).toFixed(2)}
                            </span>
                            .
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
