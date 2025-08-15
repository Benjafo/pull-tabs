import { useEffect, useState } from "react";
import type { Ticket } from "../../services/ticketService";
import ticketService from "../../services/ticketService";
import { checkWinningLine } from "../../utils/symbols";
import { PrizeTable } from "./PrizeTable";
import { TabComponent } from "./TabComponent";
import { TreasureMapBackground } from "./TreasureMapBackground";

interface TicketComponentProps {
    ticket: Ticket;
    onComplete?: (totalWinnings: number) => void;
}

export function TicketComponent({ ticket, onComplete }: TicketComponentProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    // Convert boolean array to array of tab numbers for already revealed tabs
    const getInitialRevealedTabs = () => {
        const revealed: number[] = [];
        if (ticket.revealedTabs && Array.isArray(ticket.revealedTabs)) {
            ticket.revealedTabs.forEach((isRevealed, index) => {
                if (isRevealed) {
                    revealed.push(index + 1); // Convert 0-based index to 1-based tab number
                }
            });
        }
        return revealed;
    };
    const [revealedTabs, setRevealedTabs] = useState<number[]>(getInitialRevealedTabs());
    const [currentWinnings, setCurrentWinnings] = useState(0);
    const [isRevealing, setIsRevealing] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    // Initialize with 15 placeholder symbols if not provided
    const [symbols, setSymbols] = useState<number[]>(ticket.symbols || Array(15).fill(0));

    useEffect(() => {
        if (revealedTabs.length === 5 && onComplete && !hasCompleted) {
            setHasCompleted(true);
            onComplete(currentWinnings);
        }
    }, [revealedTabs.length, currentWinnings, onComplete, hasCompleted]);

    const handleFlip = () => {
        console.log(revealedTabs);
        if (!isFlipped) {
            setIsFlipped(true);
        }
    };

    const handleRevealTab = async (tabNumber: number) => {
        if (isRevealing || revealedTabs.includes(tabNumber)) return;

        setIsRevealing(true);
        try {
            const response = await ticketService.revealTab(ticket.id, tabNumber);
            console.log("Reveal response:", response);

            // Backend sends revealedTabs as a boolean array [true, false, false, false, false]
            // Convert to array of tab numbers (1-based) for revealed tabs
            const updatedRevealedTabs: number[] = [];
            response.ticket.revealedTabs.forEach((isRevealed, index) => {
                if (isRevealed) {
                    updatedRevealedTabs.push(index + 1); // Convert 0-based index to 1-based tab number
                }
            });
            setRevealedTabs(updatedRevealedTabs);

            // Update symbols for this specific tab from the response
            // Backend sends the tab index (0-based) in response.tab.index
            const tabIndex = response.tab.index;
            setSymbols((prevSymbols) => {
                const newSymbols = [...prevSymbols];
                response.tab.symbols.forEach((symbol, idx) => {
                    newSymbols[tabIndex * 3 + idx] = symbol;
                });
                return newSymbols;
            });

            // Update current winnings if win detected
            if (response.tab.winDetected && response.totalPayout) {
                setCurrentWinnings(response.totalPayout);
            }

            // Also check if ticket is fully revealed and has a payout
            if (response.ticket.isFullyRevealed && response.ticket.totalPayout) {
                setCurrentWinnings(response.ticket.totalPayout);
            }
        } catch (error) {
            console.error("Failed to reveal tab:", error);
        } finally {
            setIsRevealing(false);
        }
    };

    const getTabSymbols = (tabNumber: number) => {
        const startIndex = (tabNumber - 1) * 3;
        return symbols.slice(startIndex, startIndex + 3);
    };

    const isTabWinning = (tabNumber: number) => {
        if (!revealedTabs.includes(tabNumber)) return false;
        const symbols = getTabSymbols(tabNumber);
        return checkWinningLine(symbols) > 0;
    };

    return (
        <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
            <div
                className="relative w-full h-[700px] transition-transform duration-700"
                style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Front of ticket */}
                <div
                    className={`absolute inset-0 cursor-pointer ${
                        isFlipped ? "pointer-events-none" : ""
                    }`}
                    onClick={handleFlip}
                >
                    <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 rounded-xl shadow-2xl overflow-hidden">
                        {/* Treasure map background */}
                        <TreasureMapBackground />

                        {/* Aged paper effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-900/10" />

                        {/* Content */}
                        <div className="relative z-10 p-6 flex flex-col h-full">
                            {/* Header with ornate border */}
                            <div className="text-center mb-4">
                                <div className="inline-block relative">
                                    <h2 className="text-3xl font-bold text-yellow-400 drop-shadow-lg mb-2 text-amber-200/90 font-serif italic">
                                        Pirate's Treasure
                                    </h2>
                                    <div className="absolute -top-2 -left-10 text-2xl">⚓</div>
                                    <div className="absolute -top-2 -right-10 text-2xl">⚓</div>
                                </div>
                                <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-2" />
                            </div>

                            {/* Prize Table */}
                            <div className="flex-1 flex items-center justify-center">
                                <PrizeTable />
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-4">
                                <div className="inline-block px-6 py-2 bg-gradient-to-r from-amber-600/50 to-amber-700/50 rounded-full border-2 border-yellow-400/50">
                                    <p className="text-yellow-300 text-lg font-bold animate-pulse">
                                        Click to flip and play!
                                    </p>
                                </div>
                            </div>

                            {/* Corner decorations */}
                            <div className="absolute top-2 left-2">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    className="text-yellow-400/30"
                                >
                                    <path
                                        d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <div className="absolute top-2 right-2 rotate-90">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    className="text-yellow-400/30"
                                >
                                    <path
                                        d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <div className="absolute bottom-2 left-2 -rotate-90">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    className="text-yellow-400/30"
                                >
                                    <path
                                        d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <div className="absolute bottom-2 right-2 rotate-180">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    className="text-yellow-400/30"
                                >
                                    <path
                                        d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of ticket */}
                <div
                    className={`absolute inset-0 ${!isFlipped ? "pointer-events-none" : ""}`}
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl shadow-2xl p-6">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                                Reveal the Treasure!
                            </h3>
                            {/* {currentWinnings > 0 && (
                                <div className="mt-2 text-3xl font-bold text-yellow-300 animate-pulse">
                                    Won: ${currentWinnings}
                                </div>
                            )} */}
                        </div>

                        {/* Tabs */}
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((tabNumber) => (
                                <TabComponent
                                    key={tabNumber}
                                    tabNumber={tabNumber}
                                    symbols={getTabSymbols(tabNumber)}
                                    isRevealed={revealedTabs.includes(tabNumber)}
                                    isWinning={isTabWinning(tabNumber)}
                                    onReveal={handleRevealTab}
                                    disabled={isRevealing}
                                />
                            ))}
                        </div>

                        {/* Status */}
                        {(currentWinnings > 0 || revealedTabs.length === 5) && (
                            <div className="mt-6 text-center">
                                <div className="text-white text-xl font-bold">
                                    {currentWinnings > 0 ? (
                                        <span className="text-yellow-300 text-2xl animate-bounce">
                                            🎉 You won ${currentWinnings}! 🎉
                                        </span>
                                    ) : (
                                        <span>Better luck next time!</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
