import { useEffect, useState } from "react";
import { OceanBackground } from "../components/ui/OceanBackground";
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
        <div className="relative">
            <OceanBackground showAnimatedElements={false} intensity="subtle" />
            
            <div className="space-y-6 relative z-10">
                {/* Header */}
                <div className="bg-navy-600/95 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gold-600/30">
                <h1 className="text-3xl font-bold text-gold-400 mb-1">Your Pull Tab History</h1>
                <h2 className="text-sm font-normal text-cream-100/70">{user?.email}</h2>
            </div>

            {/* Stats Grid - Uniform 3x2 Layout */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Won So Far */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div>
                            <div className="text-2xl mb-3 text-gold-400/80">💰</div>
                            <h3 className="text-xs font-medium text-cream-100/60 uppercase tracking-wider mb-2">
                                Won So Far
                            </h3>
                            <p className="text-3xl font-bold">
                                <span className="text-gold-400">$</span>
                                {stats.totalWinnings > 0
                                    ? stats.totalWinnings % 1 === 0
                                        ? stats.totalWinnings.toFixed(0)
                                        : stats.totalWinnings.toFixed(2).replace(/\.?0+$/, "")
                                    : "0"}
                            </p>
                        </div>
                    </div>

                    {/* Biggest Win */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl mb-3 text-gold-400">🏆</div>
                                <h3 className="text-xs font-medium text-cream-100/60 uppercase tracking-wider mb-2">
                                    Biggest Win
                                </h3>
                                <p className="text-4xl font-bold">
                                    <span className="text-gold-400">$</span>
                                    {stats.biggestWin > 0
                                        ? stats.biggestWin % 1 === 0
                                            ? stats.biggestWin.toFixed(0)
                                            : stats.biggestWin.toFixed(2).replace(/\.?0+$/, "")
                                        : "0"}
                                </p>
                            </div>
                            <div className="text-6xl opacity-10">🏆</div>
                        </div>
                    </div>

                    {/* Win Rate */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div>
                            <div className="text-2xl mb-3 text-gold-400/80">📊</div>
                            <h3 className="text-xs font-medium text-cream-100/60 uppercase tracking-wider mb-2">
                                Win Rate
                            </h3>
                            <p className="text-3xl font-bold">
                                {stats.winRate % 1 === 0
                                    ? stats.winRate.toFixed(0)
                                    : stats.winRate.toFixed(1)}
                                %
                            </p>
                        </div>
                    </div>

                    {/* Pull Tabs Opened */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div>
                            <div className="text-2xl mb-3 text-gold-400/80">🎫</div>
                            <h3 className="text-xs font-medium text-cream-100/60 uppercase tracking-wider mb-2">
                                Pull Tabs Opened
                            </h3>
                            <p className="text-3xl font-bold">{stats.ticketsPlayed}</p>
                        </div>
                    </div>

                    {/* Last Played */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div>
                            <div className="text-2xl mb-3 text-gold-400/80">📅</div>
                            <h3 className="text-xs font-medium text-cream-100/60 uppercase tracking-wider mb-2">
                                Last Played
                            </h3>
                            <p className="text-xl font-bold">
                                {stats.lastPlayed
                                    ? new Date(stats.lastPlayed).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      })
                                    : "Never"}
                            </p>
                        </div>
                    </div>

                    {/* Times Played */}
                    <div className="bg-navy-500 rounded-lg shadow-lg p-6 text-cream-100 border border-navy-400">
                        <div>
                            <div className="text-2xl mb-3 text-gold-400/80">🎮</div>
                            <h3 className="text-xs font-medium text-cream-100/60 uppercase tracking-wider mb-2">
                                Times Played
                            </h3>
                            <p className="text-3xl font-bold">{stats.sessionsPlayed}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Summary */}
            {stats && stats.ticketsPlayed > 0 && (
                <div className="bg-navy-600 rounded-lg shadow-lg p-6 border border-gold-600/30">
                    <h3 className="text-lg font-semibold text-gold-400 mb-4">Net Performance</h3>
                    <div className="flex items-center justify-between text-base">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-cream-100/60">Spent:</span>
                                <span className="font-semibold text-cream-100">
                                    ${stats.ticketsPlayed}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-cream-100/60">Won:</span>
                                <span className="font-semibold text-cream-100">
                                    $
                                    {stats.totalWinnings % 1 === 0
                                        ? stats.totalWinnings.toFixed(0)
                                        : stats.totalWinnings.toFixed(2).replace(/\.?0+$/, "")}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-cream-100/60 mb-1">Net Result</div>
                            <div
                                className={`text-2xl font-bold ${
                                    stats.totalWinnings - stats.ticketsPlayed >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {stats.totalWinnings - stats.ticketsPlayed >= 0 ? "+" : "-"}$
                                {Math.abs(stats.totalWinnings - stats.ticketsPlayed) % 1 === 0
                                    ? Math.abs(stats.totalWinnings - stats.ticketsPlayed).toFixed(0)
                                    : Math.abs(stats.totalWinnings - stats.ticketsPlayed)
                                          .toFixed(2)
                                          .replace(/\.?0+$/, "")}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
