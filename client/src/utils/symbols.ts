export const SymbolType = {
  SKULL: 0,
  TREASURE: 1,
  SHIP: 2,
  ANCHOR: 3,
  COMPASS: 4,
  MAP: 5,
} as const;

export type SymbolType = typeof SymbolType[keyof typeof SymbolType];

export interface SymbolData {
  id: SymbolType;
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
}

export const SYMBOLS: Record<SymbolType, SymbolData> = {
  [SymbolType.SKULL]: {
    id: SymbolType.SKULL,
    name: 'Skull',
    emoji: '💀',
    color: 'text-gray-800',
    bgGradient: 'from-navy-600 to-navy-800',
  },
  [SymbolType.TREASURE]: {
    id: SymbolType.TREASURE,
    name: 'Treasure',
    emoji: '💎',
    color: 'text-purple-600',
    bgGradient: 'from-gold-600 to-gold-700',
  },
  [SymbolType.SHIP]: {
    id: SymbolType.SHIP,
    name: 'Ship',
    emoji: '⛵',
    color: 'text-blue-600',
    bgGradient: 'from-navy-500 to-navy-600',
  },
  [SymbolType.ANCHOR]: {
    id: SymbolType.ANCHOR,
    name: 'Anchor',
    emoji: '⚓',
    color: 'text-indigo-600',
    bgGradient: 'from-navy-400 to-navy-600',
  },
  [SymbolType.COMPASS]: {
    id: SymbolType.COMPASS,
    name: 'Compass',
    emoji: '🧭',
    color: 'text-amber-600',
    bgGradient: 'from-gold-500 to-gold-700',
  },
  [SymbolType.MAP]: {
    id: SymbolType.MAP,
    name: 'Map',
    emoji: '🗺️',
    color: 'text-green-600',
    bgGradient: 'from-navy-500 to-navy-700',
  },
};

export const WINNING_COMBINATIONS = [
  { symbols: [SymbolType.SKULL, SymbolType.SKULL, SymbolType.SKULL], prize: 100, name: 'Triple Skull' },
  { symbols: [SymbolType.SKULL, SymbolType.SKULL, SymbolType.TREASURE], prize: 20, name: 'Skull Treasure' },
  { symbols: [SymbolType.SKULL, SymbolType.SKULL, SymbolType.SHIP], prize: 10, name: 'Skull Ship' },
  { symbols: [SymbolType.SKULL, SymbolType.SKULL, SymbolType.ANCHOR], prize: 5, name: 'Skull Anchor' },
  { symbols: [SymbolType.SKULL, SymbolType.SKULL, SymbolType.COMPASS], prize: 2, name: 'Skull Compass' },
  { symbols: [SymbolType.SKULL, SymbolType.SKULL, SymbolType.MAP], prize: 1, name: 'Skull Map' },
];

export function getSymbolById(id: number): SymbolData | undefined {
  return SYMBOLS[id as SymbolType];
}

export function checkWinningLine(symbols: number[]): number {
  if (symbols.length !== 3) return 0;
  
  for (const combo of WINNING_COMBINATIONS) {
    if (symbols[0] === combo.symbols[0] && 
        symbols[1] === combo.symbols[1] && 
        symbols[2] === combo.symbols[2]) {
      return combo.prize;
    }
  }
  
  return 0;
}