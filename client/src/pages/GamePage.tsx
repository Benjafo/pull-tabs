import { useEffect, useState } from "react";
import type { GameBoxStatus, UserStats } from "../services/statsService";
import type { Ticket } from "../services/ticketService";
import statsService from "../services/statsService";
import ticketService from "../services/ticketService";
import { TicketComponent } from "../components/game/TicketComponent";
import { WinAnimation } from "../components/game/WinAnimation";
import { GameStatusPanel } from "../components/game/GameStatusPanel";

export function GamePage() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [gameBox, setGameBox] = useState<GameBoxStatus | null>(null);
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showWinAnimation, setShowWinAnimation] = useState(false);
    const [lastWinAmount, setLastWinAmount] = useState(0);
    const [currentWinnings, setCurrentWinnings] = useState(0);

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

    const handlePurchaseTicket = async () => {
        if (isPurchasing) return;

        try {
            setIsPurchasing(true);
            setError(null);
            const response = await ticketService.purchaseTicket();
            setCurrentTicket(response.ticket);
            setGameBox(prev => ({
                ...prev!,
                remainingTickets: response.gameBox.remainingTickets,
            }));
            setCurrentWinnings(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to purchase ticket");
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleTicketComplete = async (totalWinnings: number) => {
        setCurrentWinnings(totalWinnings);
        if (totalWinnings > 0) {
            setLastWinAmount(totalWinnings);
            setShowWinAnimation(true);
        }
        
        // Reload stats to show updated values
        const [userStats, boxStatus] = await Promise.all([
            statsService.getUserStats(),
            statsService.getCurrentGameBox(),
        ]);
        setStats(userStats);
        setGameBox(boxStatus);
    };

    const handleNewTicket = () => {
        setCurrentTicket(null);
        setCurrentWinnings(0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-white text-xl animate-pulse">Loading game...</div>
            </div>
        );
    }

    if (error && !currentTicket) {
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
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {!currentTicket ? (
                            <button
                                onClick={handlePurchaseTicket}
                                disabled={isPurchasing}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-lg text-lg font-bold transform transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPurchasing ? 'Purchasing...' : 'Buy Ticket ($1)'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNewTicket}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg text-lg font-bold transform transition-all hover:scale-105 hover:shadow-xl"
                            >
                                New Ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="min-h-[650px] flex items-center justify-center">
                {currentTicket ? (
                    <TicketComponent 
                        ticket={currentTicket} 
                        onComplete={handleTicketComplete}
                    />
                ) : (
                    <div className="bg-gradient-treasure rounded-lg shadow-lg p-12 text-center text-white max-w-2xl">
                        <div className="text-6xl mb-6">🏴‍☠️</div>
                        <h3 className="text-3xl font-bold mb-4">Welcome to Pirate's Treasure!</h3>
                        <p className="text-xl mb-8 opacity-90">
                            Purchase a ticket to reveal hidden treasures and win up to $100!
                        </p>
                        <button
                            onClick={handlePurchaseTicket}
                            disabled={isPurchasing}
                            className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 px-10 py-4 rounded-lg text-xl font-bold transform transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPurchasing ? 'Purchasing...' : 'Start Playing'}
                        </button>
                    </div>
                )}
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

            {/* Game Status Panel */}
            <GameStatusPanel 
                gameBox={gameBox} 
                currentWinnings={currentWinnings}
                isPlaying={!!currentTicket}
            />

            {/* Win Animation */}
            {showWinAnimation && (
                <WinAnimation 
                    amount={lastWinAmount} 
                    onComplete={() => setShowWinAnimation(false)}
                />
            )}
        </div>
    );
}
