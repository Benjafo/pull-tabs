interface SymbolProps {
  className?: string;
  size?: number;
}

export function ShipSymbol({ className = "", size = 48 }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
        <linearGradient id="hullGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#654321" />
        </linearGradient>
        <filter id="shipShadow">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Mast */}
      <rect x="48" y="20" width="4" height="50" fill="#654321" />
      
      {/* Main sail */}
      <path
        d="M 25 25 Q 15 40 25 55 L 47 50 L 47 30 Z"
        fill="url(#sailGradient)"
        filter="url(#shipShadow)"
      >
        <animateTransform
          attributeName="transform"
          type="skewX"
          values="0;2;0;-2;0"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Secondary sail */}
      <path
        d="M 53 30 L 53 50 L 75 55 Q 85 40 75 25 Z"
        fill="url(#sailGradient)"
        filter="url(#shipShadow)"
      >
        <animateTransform
          attributeName="transform"
          type="skewX"
          values="0;-2;0;2;0"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Pirate flag */}
      <g transform="translate(50, 20)">
        <rect x="0" y="-5" width="20" height="12" fill="#000000" />
        <circle cx="10" cy="1" r="2" fill="#FFFFFF" />
        <rect x="8" y="3" width="4" height="1" fill="#FFFFFF" />
        <rect x="7" y="4" width="1" height="1" fill="#FFFFFF" />
        <rect x="9" y="4" width="2" height="1" fill="#FFFFFF" />
        <rect x="12" y="4" width="1" height="1" fill="#FFFFFF" />
      </g>
      
      {/* Hull */}
      <path
        d="M 15 70 Q 50 80 85 70 L 80 65 L 20 65 Z"
        fill="url(#hullGradient)"
        filter="url(#shipShadow)"
      />
      
      {/* Cannon ports */}
      <circle cx="30" cy="68" r="2" fill="#000000" />
      <circle cx="40" cy="68" r="2" fill="#000000" />
      <circle cx="60" cy="68" r="2" fill="#000000" />
      <circle cx="70" cy="68" r="2" fill="#000000" />
      
      {/* Waves */}
      <path
        d="M 10 75 Q 20 72 30 75 T 50 75 T 70 75 T 90 75"
        fill="none"
        stroke="#4A90E2"
        strokeWidth="2"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values="M 10 75 Q 20 72 30 75 T 50 75 T 70 75 T 90 75;
                  M 10 75 Q 20 78 30 75 T 50 75 T 70 75 T 90 75;
                  M 10 75 Q 20 72 30 75 T 50 75 T 70 75 T 90 75"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M 5 80 Q 15 77 25 80 T 45 80 T 65 80 T 85 80 T 95 80"
        fill="none"
        stroke="#4A90E2"
        strokeWidth="2"
        opacity="0.4"
      >
        <animate
          attributeName="d"
          values="M 5 80 Q 15 77 25 80 T 45 80 T 65 80 T 85 80 T 95 80;
                  M 5 80 Q 15 83 25 80 T 45 80 T 65 80 T 85 80 T 95 80;
                  M 5 80 Q 15 77 25 80 T 45 80 T 65 80 T 85 80 T 95 80"
          dur="3s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </path>
    </svg>
  );
}