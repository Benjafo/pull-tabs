import { getSymbolById } from '../../utils/symbols';

interface SymbolDisplayProps {
  symbolId: number;
  isRevealed: boolean;
  isWinning?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function SymbolDisplay({ symbolId, isRevealed, isWinning = false, size = 'medium' }: SymbolDisplayProps) {
  const symbol = getSymbolById(symbolId);
  
  if (!symbol) {
    return null;
  }

  const sizeClasses = {
    small: 'w-12 h-12 text-2xl',
    medium: 'w-16 h-16 text-3xl',
    large: 'w-20 h-20 text-4xl',
  };

  const animationClass = isRevealed ? 'animate-bounce-slow' : '';
  const winningClass = isWinning ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : '';

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${animationClass}
        ${winningClass}
        relative flex items-center justify-center
        bg-gradient-to-br ${symbol.bgGradient}
        rounded-lg shadow-lg
        transform transition-all duration-500
        ${isRevealed ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
      `}
    >
      <span className="text-white drop-shadow-lg">
        {symbol.emoji}
      </span>
      {isWinning && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-transparent opacity-30 rounded-lg animate-pulse" />
      )}
    </div>
  );
}