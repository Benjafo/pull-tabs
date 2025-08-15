import { useState } from 'react';
import { SymbolDisplay } from './SymbolDisplay';

interface TabComponentProps {
  tabNumber: number;
  symbols: number[];
  isRevealed: boolean;
  isWinning: boolean;
  onReveal: (tabNumber: number) => void;
  disabled?: boolean;
}

export function TabComponent({ 
  tabNumber, 
  symbols, 
  isRevealed, 
  isWinning,
  onReveal, 
  disabled = false 
}: TabComponentProps) {
  const [isPeeling, setIsPeeling] = useState(false);

  const handleClick = () => {
    if (isRevealed || disabled || isPeeling) return;
    
    setIsPeeling(true);
    setTimeout(() => {
      onReveal(tabNumber);
      setIsPeeling(false);
    }, 600);
  };

  return (
    <div className="relative">
      {/* Symbols underneath */}
      <div className="flex gap-2 p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
        {symbols.map((symbolId, index) => (
          <SymbolDisplay
            key={`${tabNumber}-${index}`}
            symbolId={symbolId}
            isRevealed={isRevealed}
            isWinning={isWinning}
            size="medium"
          />
        ))}
      </div>

      {/* Peelable tab overlay */}
      {!isRevealed && (
        <div
          className={`
            absolute inset-0 cursor-pointer
            bg-gradient-to-br from-amber-400 to-amber-600
            rounded-lg shadow-lg
            flex items-center justify-center
            transform-gpu transition-all duration-600
            ${isPeeling ? 'tab-peel-animation' : 'hover:scale-105'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
          `}
          onClick={handleClick}
        >
          <div className="text-center">
            <div className="text-white font-bold text-lg drop-shadow-md">
              TAB {tabNumber}
            </div>
            <div className="text-white/80 text-xs mt-1">
              Click to reveal
            </div>
          </div>
          
          {/* Perforated edge effect */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-repeating-linear-gradient">
            <div className="w-full h-full opacity-30 bg-gradient-to-b from-black to-transparent" />
          </div>
        </div>
      )}

      <style jsx>{`
        .tab-peel-animation {
          animation: peelOff 0.6s ease-in-out forwards;
        }

        @keyframes peelOff {
          0% {
            transform: rotateX(0deg) translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: rotateX(-15deg) translateY(-10px) scale(1.05);
            opacity: 0.9;
          }
          100% {
            transform: rotateX(-90deg) translateY(-50px) scale(0.8);
            opacity: 0;
          }
        }

        .bg-repeating-linear-gradient {
          background-image: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 4px,
            rgba(0, 0, 0, 0.1) 4px,
            rgba(0, 0, 0, 0.1) 8px
          );
        }
      `}</style>
    </div>
  );
}