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
            <div className="bg-navy-600 rounded-lg shadow-lg p-6 border border-gold-600/30 transform rotate-[-0.5deg] hover:rotate-0 transition-transform">
                <h1 className="text-4xl font-black text-gold-400 mb-1">Your Pull Tab History</h1>
                <h2 className="text-lg font-light text-cream-100/80">{user?.email}</h2>
            </div>

            {/* Stats Grid - Asymmetric Layout */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Tickets Played - Standard Size */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-5 text-cream-100 border border-navy-400 transform translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl mb-1 opacity-80">🎫</div>
                                <h3 className="text-sm font-medium opacity-70 uppercase tracking-wider">Tickets Played</h3>
                                <p className="text-4xl font-black mt-1">{stats.ticketsPlayed}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Winnings - Larger, Important */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-7 text-cream-100 border-2 border-gold-600/30 md:col-span-2 lg:col-span-1 transform -rotate-[0.3deg]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-5xl mb-2 opacity-90">💰</div>
                                <h3 className="text-base font-bold opacity-80">Total Winnings</h3>
                                <p className="text-5xl font-black mt-3 text-gold-300">
                                    ${stats.totalWinnings > 0 ? (stats.totalWinnings % 1 === 0 ? stats.totalWinnings.toFixed(0) : stats.totalWinnings.toFixed(2).replace(/\.?0+$/, '')) : '0'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Biggest Win - Featured */}
                    <div className="bg-gradient-to-br from-gold-700 to-gold-600 rounded-lg shadow-2xl p-8 text-cream-100 border-2 border-gold-500 lg:col-span-2 transform translate-x-1 hover:scale-[1.02] transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-6xl mb-3 filter drop-shadow-lg">🏆</div>
                                <h3 className="text-xl font-black uppercase tracking-wide text-cream-200">Biggest Win</h3>
                                <p className="text-6xl font-black mt-4 text-white">
                                    ${stats.biggestWin > 0 ? (stats.biggestWin % 1 === 0 ? stats.biggestWin.toFixed(0) : stats.biggestWin.toFixed(2).replace(/\.?0+$/, '')) : '0'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Win Rate - Compact */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-4 text-cream-100 border border-navy-400 transform rotate-[0.2deg]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl mb-1 opacity-70">📊</div>
                                <h3 className="text-xs font-semibold opacity-60 uppercase tracking-widest">Win Rate</h3>
                                <p className="text-3xl font-extrabold mt-1">
                                    {stats.winRate % 1 === 0 ? stats.winRate.toFixed(0) : stats.winRate.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sessions - Medium */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-5 text-cream-100 border border-navy-400 transform -translate-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl mb-2 opacity-75">🎮</div>
                                <h3 className="text-sm font-bold opacity-75">
                                    Sessions
                                </h3>
                                <p className="text-4xl font-bold mt-2">{stats.sessionsPlayed}</p>
                            </div>
                        </div>
                    </div>

                    {/* Last Played - Small */}
                    <div className="bg-navy-600 rounded-lg shadow-lg p-4 text-cream-100 border border-navy-500 transform translate-x-2 rotate-[-0.4deg]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl mb-1 opacity-60">📅</div>
                                <h3 className="text-xs font-light opacity-50 uppercase tracking-wider">Last Session</h3>
                                <p className="text-xl font-medium mt-1">
                                    {stats.lastPlayed
                                        ? new Date(stats.lastPlayed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                        : "Never"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Summary */}
            {stats && stats.ticketsPlayed > 0 && (
                <div className="bg-navy-600 rounded-lg shadow-lg p-6 border border-gold-600/30 transform rotate-[0.3deg] hover:rotate-0 transition-transform">
                    <h3 className="text-xl font-black text-gold-400 mb-3 uppercase tracking-wide">Net Performance</h3>
                    <div className="text-base text-cream-100/90">
                        <p className="leading-relaxed">
                            <span className="font-light">Spent:</span>{" "}
                            <span className="font-extrabold text-lg text-cream-200">
                                ${stats.ticketsPlayed}
                            </span>
                            <span className="mx-3 opacity-50">•</span>
                            <span className="font-light">Won:</span>{" "}
                            <span className="font-extrabold text-lg text-gold-300">
                                ${stats.totalWinnings % 1 === 0 ? stats.totalWinnings.toFixed(0) : stats.totalWinnings.toFixed(2).replace(/\.?0+$/, '')}
                            </span>
                            <span className="mx-3 opacity-50">•</span>
                            <span
                                className={`font-black text-xl ${
                                    stats.totalWinnings - stats.ticketsPlayed >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {stats.totalWinnings - stats.ticketsPlayed >= 0 ? "+" : "-"}${Math.abs(stats.totalWinnings - stats.ticketsPlayed) % 1 === 0 ? Math.abs(stats.totalWinnings - stats.ticketsPlayed).toFixed(0) : Math.abs(stats.totalWinnings - stats.ticketsPlayed).toFixed(2).replace(/\.?0+$/, '')}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
