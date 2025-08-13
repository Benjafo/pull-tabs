import { WINNING_COMBINATIONS, SYMBOLS } from '../../utils/symbols';

interface PrizeTableProps {
  currentWinAmount?: number;
}

export function PrizeTable({ currentWinAmount }: PrizeTableProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center drop-shadow-lg">
        🏴‍☠️ Prize Table 🏴‍☠️
      </h3>
      
      <div className="space-y-2">
        {WINNING_COMBINATIONS.map((combo, index) => {
          const isCurrentWin = currentWinAmount === combo.prize;
          
          return (
            <div
              key={index}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${isCurrentWin 
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400 animate-pulse shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20'
                }
                transition-all duration-300
              `}
            >
              <div className="flex items-center gap-2">
                {combo.symbols.map((symbolId, idx) => {
                  const symbol = SYMBOLS[symbolId];
                  return (
                    <div
                      key={idx}
                      className={`
                        w-10 h-10 flex items-center justify-center
                        bg-gradient-to-br ${symbol.bgGradient}
                        rounded shadow-md
                        ${isCurrentWin ? 'animate-bounce' : ''}
                      `}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className="text-white text-xl">
                        {symbol.emoji}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`
                  font-bold text-lg
                  ${isCurrentWin ? 'text-indigo-900' : 'text-yellow-400'}
                `}>
                  ${combo.prize}
                </span>
                {isCurrentWin && (
                  <span className="text-2xl animate-bounce">
                    🎉
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-yellow-400/30">
        <div className="text-center text-yellow-400/80 text-sm">
          Match symbols on any line to win!
        </div>
      </div>
    </div>
  );
}