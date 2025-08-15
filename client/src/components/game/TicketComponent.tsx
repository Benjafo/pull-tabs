import { useState, useEffect } from 'react';
import { TabComponent } from './TabComponent';
import { PrizeTable } from './PrizeTable';
import { TreasureMapBackground } from './TreasureMapBackground';
import { checkWinningLine } from '../../utils/symbols';
import type { Ticket } from '../../services/ticketService';
import ticketService from '../../services/ticketService';

interface TicketComponentProps {
  ticket: Ticket;
  onComplete?: (totalWinnings: number) => void;
}

export function TicketComponent({ ticket, onComplete }: TicketComponentProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [revealedTabs, setRevealedTabs] = useState<number[]>(ticket.revealedTabs || []);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  // Initialize with 15 placeholder symbols if not provided
  const [symbols, setSymbols] = useState<number[]>(
    ticket.symbols || Array(15).fill(0)
  );

  useEffect(() => {
    if (revealedTabs.length === 5 && onComplete && !hasCompleted) {
      setHasCompleted(true);
      onComplete(currentWinnings);
    }
  }, [revealedTabs.length, currentWinnings, onComplete, hasCompleted]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleRevealTab = async (tabNumber: number) => {
    if (isRevealing || revealedTabs.includes(tabNumber)) return;

    setIsRevealing(true);
    try {
      const response = await ticketService.revealTab(ticket.id, tabNumber);
      console.log('Reveal response:', response);
      
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
      setSymbols(prevSymbols => {
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
      console.error('Failed to reveal tab:', error);
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
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      <div
        className={`
          relative w-full h-[600px] transition-transform duration-700 transform-style-3d
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* Front of ticket */}
        <div
          className={`
            absolute inset-0 backface-hidden cursor-pointer
            ${isFlipped ? 'pointer-events-none' : ''}
          `}
          onClick={handleFlip}
        >
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 rounded-xl shadow-2xl p-6 flex flex-col">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-yellow-400 drop-shadow-lg mb-2">
                🏴‍☠️ Pirate's Treasure 🏴‍☠️
              </h2>
              <p className="text-white/90 text-lg">Pull Tab Adventure</p>
            </div>

            {/* Prize Table */}
            <div className="flex-1 flex items-center justify-center">
              <PrizeTable />
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-yellow-400 text-lg font-semibold animate-pulse">
                Click to flip and play!
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-4xl opacity-50">⚓</div>
            <div className="absolute top-4 right-4 text-4xl opacity-50">🗺️</div>
            <div className="absolute bottom-4 left-4 text-4xl opacity-50">💰</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-50">🦜</div>
          </div>
        </div>

        {/* Back of ticket */}
        <div
          className={`
            absolute inset-0 backface-hidden rotate-y-180
            ${!isFlipped ? 'pointer-events-none' : ''}
          `}
        >
          <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl shadow-2xl p-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                Reveal the Treasure!
              </h3>
              {currentWinnings > 0 && (
                <div className="mt-2 text-3xl font-bold text-yellow-300 animate-pulse">
                  Won: ${currentWinnings}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(tabNumber => (
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
            {revealedTabs.length === 5 && (
              <div className="mt-4 text-center">
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

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}