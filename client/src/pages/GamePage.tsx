import { useCallback, useEffect, useState } from "react";
import { EnhancedWinAnimation } from "../components/game/EnhancedWinAnimation";
import { GameStatusPanel } from "../components/game/GameStatusPanel";
import { TicketComponent } from "../components/game/TicketComponent";
import type { GameBoxStatus, UserStats } from "../services/statsService";
import statsService from "../services/statsService";
import type { Ticket } from "../services/ticketService";
import ticketService from "../services/ticketService";

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

            // Fetch the full ticket details after purchase
            const fullTicket = await ticketService.getTicket(response.ticket.id.toString());
            setCurrentTicket(fullTicket);

            // Refresh game box status
            const boxStatus = await statsService.getCurrentGameBox();
            setGameBox(boxStatus);

            setCurrentWinnings(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to purchase ticket");
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleTicketComplete = useCallback(async (totalWinnings: number) => {
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
    }, []);

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
                <div className="bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 rounded-lg shadow-xl p-8 max-w-md text-center border border-amber-400/30">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Game</h2>
                    <p className="text-amber-200/80 mb-6">{error}</p>
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
            <div className="bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 border border-amber-400/30">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <h2 className="text-3xl font-bold text-amber-200">Pull Tabs Treasure Game</h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {!currentTicket ? (
                            <button
                                onClick={handlePurchaseTicket}
                                disabled={isPurchasing}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-lg text-lg font-bold transform transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPurchasing ? "Purchasing..." : "Buy Ticket ($1)"}
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
                    <TicketComponent ticket={currentTicket} onComplete={handleTicketComplete} />
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
                            {isPurchasing ? "Purchasing..." : "Start Playing"}
                        </button>
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
                <EnhancedWinAnimation
                    amount={lastWinAmount}
                    onComplete={() => setShowWinAnimation(false)}
                />
            )}
        </div>
    );
}
