import { getSymbolById, SymbolType } from '../../utils/symbols';
import {
  SkullSymbol,
  TreasureSymbol,
  ShipSymbol,
  AnchorSymbol,
  CompassSymbol,
  MapSymbol
} from '../symbols';

interface SymbolDisplayProps {
  symbolId: number;
  isRevealed: boolean;
  isWinning?: boolean;
  size?: 'small' | 'medium' | 'large';
  disableAnimation?: boolean;
}

export function SymbolDisplay({ symbolId, isRevealed, isWinning = false, size = 'medium', disableAnimation = false }: SymbolDisplayProps) {
  const symbol = getSymbolById(symbolId);
  
  if (!symbol) {
    return null;
  }

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  const sizePixels = {
    small: 48,
    medium: 64,
    large: 80,
  };

  const animationClass = isRevealed ? 'animate-bounce-slow' : '';
  const winningClass = isWinning ? 'ring-4 ring-gold-400 ring-opacity-75 animate-pulse' : '';

  const renderSymbol = () => {
    const symbolSize = sizePixels[size];
    switch (symbolId) {
      case SymbolType.SKULL:
        return <SkullSymbol size={symbolSize} />;
      case SymbolType.TREASURE:
        return <TreasureSymbol size={symbolSize} />;
      case SymbolType.SHIP:
        return <ShipSymbol size={symbolSize} />;
      case SymbolType.ANCHOR:
        return <AnchorSymbol size={symbolSize} />;
      case SymbolType.COMPASS:
        return <CompassSymbol size={symbolSize} />;
      case SymbolType.MAP:
        return <MapSymbol size={symbolSize} />;
      default:
        return <span className="text-cream-100 drop-shadow-lg text-2xl">{symbol.emoji}</span>;
    }
  };

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
        ${isRevealed ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 to-transparent opacity-10 rounded-lg" />
      {renderSymbol()}
      {isWinning && (
        <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-transparent opacity-30 rounded-lg animate-pulse" />
      )}
    </div>
  );
}