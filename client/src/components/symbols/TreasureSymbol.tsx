interface SymbolProps {
  className?: string;
  size?: number;
}

export function TreasureSymbol({ className = "", size = 48 }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="50%" stopColor="#654321" />
          <stop offset="100%" stopColor="#4B2F1A" />
        </linearGradient>
        <radialGradient id="goldGradient" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </radialGradient>
        <filter id="treasureGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Chest base */}
      <rect
        x="20"
        y="50"
        width="60"
        height="35"
        rx="3"
        fill="url(#chestGradient)"
      />
      
      {/* Chest lid */}
      <path
        d="M 20 50 Q 50 30 80 50 L 80 55 Q 50 35 20 55 Z"
        fill="url(#chestGradient)"
      />
      
      {/* Gold coins overflowing */}
      <g filter="url(#treasureGlow)">
        {/* Coins */}
        <ellipse cx="35" cy="48" rx="8" ry="4" fill="url(#goldGradient)">
          <animate
            attributeName="cy"
            values="48;46;48"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="50" cy="45" rx="8" ry="4" fill="url(#goldGradient)">
          <animate
            attributeName="cy"
            values="45;43;45"
            dur="3s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </ellipse>
        <ellipse cx="65" cy="48" rx="8" ry="4" fill="url(#goldGradient)">
          <animate
            attributeName="cy"
            values="48;46;48"
            dur="3s"
            repeatCount="indefinite"
            begin="1s"
          />
        </ellipse>
        
        {/* Jewels */}
        <polygon
          points="45,40 50,35 55,40 52,45 48,45"
          fill="#FF1493"
          opacity="0.9"
        >
          <animate
            attributeName="opacity"
            values="0.9;0.6;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
        </polygon>
        
        {/* Pearl necklace */}
        <circle cx="40" cy="42" r="3" fill="#FFF8DC" />
        <circle cx="45" cy="41" r="3" fill="#FFF8DC" />
        <circle cx="50" cy="40" r="3" fill="#FFF8DC" />
        <circle cx="55" cy="41" r="3" fill="#FFF8DC" />
        <circle cx="60" cy="42" r="3" fill="#FFF8DC" />
      </g>
      
      {/* Lock */}
      <rect x="45" y="60" width="10" height="12" rx="1" fill="#FFD700" />
      <path d="M 47 62 L 47 65 L 53 65 L 53 62" fill="none" stroke="#654321" strokeWidth="1" />
      
      {/* Metal corners */}
      <path d="M 20 50 L 25 50 L 20 55" fill="#FFD700" />
      <path d="M 80 50 L 75 50 L 80 55" fill="#FFD700" />
      <path d="M 20 85 L 25 85 L 20 80" fill="#FFD700" />
      <path d="M 80 85 L 75 85 L 80 80" fill="#FFD700" />
    </svg>
  );
}