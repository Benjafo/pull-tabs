interface SymbolProps {
  className?: string;
  size?: number;
}

export function AnchorSymbol({ className = "", size = 48 }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="anchorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#708090" />
          <stop offset="50%" stopColor="#4A5568" />
          <stop offset="100%" stopColor="#2D3748" />
        </linearGradient>
        <filter id="anchorShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.4" />
        </filter>
        <filter id="rustTexture">
          <feTurbulence baseFrequency="0.02" numOctaves="3" seed="5" />
          <feColorMatrix values="0 0 0 0 0.6
                                0 0 0 0 0.3
                                0 0 0 0 0.1
                                0 0 0 1 0" />
          <feComposite operator="multiply" in2="SourceGraphic" />
        </filter>
      </defs>
      
      {/* Ring at top */}
      <circle
        cx="50"
        cy="20"
        r="8"
        fill="none"
        stroke="url(#anchorGradient)"
        strokeWidth="3"
        filter="url(#anchorShadow)"
      />
      
      {/* Vertical shaft */}
      <rect
        x="47"
        y="28"
        width="6"
        height="40"
        fill="url(#anchorGradient)"
        filter="url(#rustTexture)"
      />
      
      {/* Horizontal crossbar */}
      <rect
        x="30"
        y="35"
        width="40"
        height="5"
        fill="url(#anchorGradient)"
        filter="url(#rustTexture)"
      />
      
      {/* Left fluke */}
      <g transform="translate(30, 68)">
        <path
          d="M 0 0 Q -10 5 -12 15 Q -10 18 -5 18 L 0 10 Z"
          fill="url(#anchorGradient)"
          filter="url(#anchorShadow)"
        />
        <polygon
          points="-12,15 -15,20 -10,18"
          fill="url(#anchorGradient)"
        />
      </g>
      
      {/* Right fluke */}
      <g transform="translate(70, 68)">
        <path
          d="M 0 0 Q 10 5 12 15 Q 10 18 5 18 L 0 10 Z"
          fill="url(#anchorGradient)"
          filter="url(#anchorShadow)"
        />
        <polygon
          points="12,15 15,20 10,18"
          fill="url(#anchorGradient)"
        />
      </g>
      
      {/* Center decoration */}
      <circle cx="50" cy="50" r="4" fill="#FFD700" opacity="0.8">
        <animate
          attributeName="r"
          values="4;5;4"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Rope wrapped around */}
      <g opacity="0.6">
        <path
          d="M 35 30 Q 40 32 45 30 T 55 30 T 65 30"
          fill="none"
          stroke="#8B7355"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 35 40 Q 40 42 45 40 T 55 40 T 65 40"
          fill="none"
          stroke="#8B7355"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      
      {/* Rust spots */}
      <circle cx="45" cy="55" r="1.5" fill="#8B4513" opacity="0.5" />
      <circle cx="55" cy="45" r="1" fill="#8B4513" opacity="0.5" />
      <circle cx="52" cy="62" r="1.2" fill="#8B4513" opacity="0.5" />
    </svg>
  );
}