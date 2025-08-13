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
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-white text-xl animate-pulse">Loading game...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Game</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={loadGameData}
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
            {/* Game Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <h2 className="text-3xl font-bold text-primary-800">Pull Tabs Treasure Game</h2>
                    {gameBox && (
                        <div className="text-right">
                            <div className="text-sm text-gray-600">
                                Box Progress: {gameBox.totalTickets - gameBox.remainingTickets}/{gameBox.totalTickets}
                            </div>
                            <div className="text-lg font-semibold text-blue-600">
                                {gameBox.remainingTickets} tickets remaining
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Game Area */}
            <div className="bg-gradient-treasure rounded-lg shadow-lg p-8 text-center text-white">
                <p className="text-4xl mb-6">🎫</p>
                <p className="text-xl mb-8">Ticket interface will be implemented in Phase 4</p>
                <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg text-lg font-bold transform transition-all hover:scale-105 hover:shadow-xl">
                    Buy Ticket ($1)
                </button>
            </div>

            {/* Stats Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-primary-800 mb-6">Your Statistics</h3>
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Tickets Played</div>
                            <div className="text-2xl font-bold text-blue-700">{stats.ticketsPlayed}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Total Winnings</div>
                            <div className="text-2xl font-bold text-green-700">
                                ${stats.totalWinnings.toFixed(2)}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Biggest Win</div>
                            <div className="text-2xl font-bold text-amber-700">
                                ${stats.biggestWin.toFixed(2)}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                            <div className="text-2xl font-bold text-purple-700">
                                {stats.winRate.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
