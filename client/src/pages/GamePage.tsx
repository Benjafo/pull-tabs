import { useCallback, useEffect, useState } from "react";
import { EnhancedWinAnimation } from "../components/game/EnhancedWinAnimation";
import { GameStatusPanel } from "../components/game/GameStatusPanel";
import { TicketComponent } from "../components/game/TicketComponent";
import type { GameBoxStatus } from "../services/statsService";
import statsService from "../services/statsService";
import type { Ticket } from "../services/ticketService";
import ticketService from "../services/ticketService";

export function GamePage() {
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
            const boxStatus = await statsService.getCurrentGameBox();
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

        // Reload game box to show updated values
        const boxStatus = await statsService.getCurrentGameBox();
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
                <div className="bg-navy-600 rounded-lg shadow-xl p-8 max-w-md text-center border border-gold-600/30">
                    <h2 className="text-2xl font-bold text-gold-400 mb-4">Error Loading Game</h2>
                    <p className="text-cream-100/80 mb-6">{error}</p>
                    <button
                        onClick={loadGameData}
                        className="bg-gold-600 hover:bg-gold-700 text-cream-100 px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Gradient Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Radial gradient for treasure glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold-600/5 via-gold-700/3 to-transparent rounded-full blur-3xl" />
                
                {/* Moving gradient orbs for depth */}
                <div className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-br from-navy-500/20 to-purple-900/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}} />
                <div className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-tl from-gold-700/10 to-navy-600/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}} />
                
                {/* Wave pattern at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-navy-800/30 via-navy-700/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gold-900/10 to-transparent" />
                
                {/* Subtle mesh overlay */}
                <div className="absolute inset-0 opacity-[0.02]" 
                     style={{
                         backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), 
                                          linear-gradient(-45deg, #000 25%, transparent 25%), 
                                          linear-gradient(45deg, transparent 75%, #000 75%), 
                                          linear-gradient(-45deg, transparent 75%, #000 75%)`,
                         backgroundSize: '20px 20px',
                         backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                     }} />
            </div>

            <div className="relative space-y-6">
                {/* Game Header with Glow Effect */}
                <div className="bg-gradient-to-br from-navy-600 to-navy-700 rounded-lg shadow-2xl p-6 border-2 border-gold-600/40 relative overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_3s_infinite]" />
                    
                    <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 mb-1">
                                Pull Tabs Treasure Game
                            </h2>
                            <p className="text-sm text-cream-100/60">Test your luck and find the hidden treasure!</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            {!currentTicket ? (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-yellow-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                                    <button
                                        onClick={handlePurchaseTicket}
                                        disabled={isPurchasing}
                                        className="relative bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-navy-900 px-10 py-4 rounded-lg text-lg font-black transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        <span className="flex items-center gap-2">
                                            {isPurchasing ? (
                                                <>Purchasing...</>
                                            ) : (
                                                <>
                                                    <span className="text-2xl">🎫</span>
                                                    Buy Ticket ($1)
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleNewTicket}
                                    className="bg-gradient-to-r from-navy-500 to-navy-600 hover:from-navy-400 hover:to-navy-500 text-cream-100 px-8 py-3 rounded-lg text-lg font-bold transform transition-all hover:scale-105 hover:shadow-xl border border-navy-400"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">🔄</span>
                                        New Ticket
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Game Area with Enhanced Visual */}
                <div className="min-h-[650px] flex items-center justify-center relative">
                    {currentTicket ? (
                        <div className="relative w-full max-w-md">
                            {/* Glow effect behind active ticket */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-gold-600/20 blur-3xl" />
                            <div className="relative">
                                <TicketComponent ticket={currentTicket} onComplete={handleTicketComplete} />
                            </div>
                        </div>
                    ) : (
                        <div className="relative group">
                            {/* Animated border glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-gold-400/20 via-gold-600/30 to-gold-400/20 rounded-lg blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
                            
                            <div className="relative bg-gradient-to-br from-navy-600 via-navy-700 to-navy-600 rounded-lg shadow-2xl p-12 text-center text-cream-100 max-w-2xl border-2 border-gold-600/30">
                                {/* Corner decorations */}
                                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold-400/50 rounded-tl-lg" />
                                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold-400/50 rounded-tr-lg" />
                                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gold-400/50 rounded-bl-lg" />
                                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gold-400/50 rounded-br-lg" />
                                
                                <div className="relative">
                                    <div className="text-8xl mb-6 animate-bounce" style={{animationDuration: '2s'}}>🏴‍☠️</div>
                                    <h3 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                                        Welcome to Pirate's Treasure!
                                    </h3>
                                    <p className="text-xl mb-2 opacity-90">
                                        Purchase a ticket to reveal hidden treasures
                                    </p>
                                    <div className="flex justify-center gap-4 mb-8">
                                        <span className="text-3xl animate-pulse" style={{animationDelay: '0.2s'}}>💰</span>
                                        <span className="text-2xl font-bold text-gold-400">Win up to $100!</span>
                                        <span className="text-3xl animate-pulse" style={{animationDelay: '0.4s'}}>💎</span>
                                    </div>
                                    <div className="relative inline-block group/button">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-gold-400 rounded-lg blur opacity-75 group-hover/button:opacity-100 transition duration-200"></div>
                                        <button
                                            onClick={handlePurchaseTicket}
                                            disabled={isPurchasing}
                                            className="relative bg-gradient-to-r from-gold-500 via-yellow-400 to-gold-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-navy-900 px-12 py-5 rounded-lg text-xl font-black transform transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                backgroundSize: '200% 100%',
                                                backgroundPosition: '0% 50%',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = '100% 50%'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = '0% 50%'}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="text-2xl">🎰</span>
                                                {isPurchasing ? "Purchasing..." : "Start Playing"}
                                                <span className="text-2xl">🎲</span>
                                            </span>
                                        </button>
                                    </div>
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
                    <EnhancedWinAnimation
                        amount={lastWinAmount}
                        onComplete={() => setShowWinAnimation(false)}
                    />
                )}
            </div>
        </div>
    );
}
