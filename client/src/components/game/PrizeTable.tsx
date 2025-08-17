import { FaStar } from "react-icons/fa";
import { WINNING_COMBINATIONS } from "../../utils/symbols";
import { SymbolDisplay } from "./SymbolDisplay";

interface PrizeTableProps {
    currentWinAmount?: number;
    noBorder?: boolean;
    noBackground?: boolean;
}

export function PrizeTable({ currentWinAmount, noBorder = false, noBackground = false }: PrizeTableProps) {
    return (
        <div className={`${noBackground ? '' : 'bg-navy-600 rounded-lg p-6 shadow-xl'} ${noBorder ? '' : 'border border-navy-500'}`}>
            {/* <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center drop-shadow-lg">
                Prize Table
            </h3> */}

            <div className="space-y-2">
                {WINNING_COMBINATIONS.map((combo, index) => {
                    const isCurrentWin = currentWinAmount === combo.prize;

                    return (
                        <div
                            key={index}
                            className={`
                flex items-center justify-between p-3 rounded-lg
                ${
                    isCurrentWin
                        ? "bg-gold-600 animate-pulse shadow-lg"
                        : "bg-navy-500/50"
                }
                transition-all duration-300 select-none
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
                        ${isCurrentWin ? "animate-bounce" : ""}
                      `}
                                            style={{ animationDelay: `${idx * 100}ms` }}
                                        >
                                            <span className="text-cream-100 text-xl">
                                                {symbol.emoji}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    className={`
                  font-bold text-lg
                  ${isCurrentWin ? "text-navy-900" : "text-gold-400"}
                `}
                                >
                                    ${combo.prize}
                                </span>
                                {isCurrentWin && (
                                    <FaStar className="text-2xl animate-bounce text-gold-400" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4">
                <div className="text-center text-cream-100/80 text-sm">
                    Match symbols on any line to win!
                </div>
            </div>
        </div>
    );
}
