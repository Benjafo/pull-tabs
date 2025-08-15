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
            bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600
            rounded-lg shadow-lg
            flex flex-col items-center justify-center
            transform-gpu transition-all duration-300
            ${isPeeling ? 'tab-peel-animation' : 'hover:scale-105 hover:brightness-110'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
          `}
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center'
          }}
          onClick={handleClick}
        >
          {/* Perforated edges on all sides */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            {/* Top perforation */}
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
              }}
            />
            {/* Bottom perforation */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
              }}
            />
            {/* Left perforation */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-1"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
              }}
            />
            {/* Right perforation */}
            <div 
              className="absolute top-0 bottom-0 right-0 w-1"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
              }}
            />
          </div>
          
          {/* Metallic foil effect */}
          <div className="absolute inset-0 rounded-lg opacity-20 bg-gradient-to-tr from-white via-transparent to-white" />
          
          {/* Tab content */}
          <div className="relative text-center z-10">
            <div className="text-white font-bold text-lg drop-shadow-lg">
              TAB {tabNumber}
            </div>
            <div className="text-amber-100/90 text-xs mt-1 font-semibold">
              PULL TO REVEAL
            </div>
          </div>
          
          {/* Scratch texture overlay */}
          <div className="absolute inset-0 rounded-lg opacity-10">
            <svg width="100%" height="100%">
              <filter id="scratches">
                <feTurbulence baseFrequency="0.02" numOctaves="5" result="noise" seed={tabNumber} />
                <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#scratches)" />
            </svg>
          </div>
        </div>
      )}

      <style>{`
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