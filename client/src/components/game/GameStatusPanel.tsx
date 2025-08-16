import type { GameBoxStatus } from '../../services/statsService';

interface GameStatusPanelProps {
  gameBox: GameBoxStatus | null;
  currentWinnings: number;
  isPlaying: boolean;
}

export function GameStatusPanel({ gameBox, currentWinnings, isPlaying }: GameStatusPanelProps) {
  if (!gameBox) return null;

  const ticketsUsed = gameBox.totalTickets - gameBox.remainingTickets;
  const progressPercentage = (ticketsUsed / gameBox.totalTickets) * 100;

  return (
    <div className="fixed bottom-4 right-4 bg-navy-600 rounded-lg shadow-xl p-4 min-w-[250px] z-40 border border-gold-600/30">
      {/* Current Session */}
      {isPlaying && currentWinnings > 0 && (
        <div className="mb-3 pb-3 border-b border-gold-600/30">
          <div className="text-sm text-cream-100 mb-1">Current Ticket</div>
          <div className="text-2xl font-bold text-gold-400 animate-pulse drop-shadow-lg">
            ${currentWinnings}
          </div>
        </div>
      )}

      {/* Box Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-cream-100">Box Progress</span>
          <span className="text-xs text-gold-300/80">
            {ticketsUsed}/{gameBox.totalTickets}
          </span>
        </div>
        
        <div className="relative w-full bg-navy-700/50 rounded-full h-3 overflow-hidden border border-gold-600/20">
          <div
            className="absolute top-0 left-0 h-full bg-gold-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent animate-shimmer" />
        </div>

        <div className="text-xs text-cream-100/80 text-center">
          {gameBox.remainingTickets} tickets remaining
        </div>
      </div>

      {/* Winners Remaining */}
      {gameBox.winnersRemaining && (
        <div className="mt-3 pt-3 border-t border-amber-400/30">
          <div className="text-xs font-semibold text-amber-200 mb-2">Winners in Box</div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            {Object.entries(gameBox.winnersRemaining)
              .filter(([, count]) => count > 0)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([prize, count]) => (
                <div key={prize} className="flex items-center gap-1">
                  <span className="font-bold text-yellow-400">${prize}:</span>
                  <span className="text-amber-300/80">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}