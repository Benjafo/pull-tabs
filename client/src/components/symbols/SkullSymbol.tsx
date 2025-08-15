interface SymbolProps {
  className?: string;
  size?: number;
}

export function SkullSymbol({ className = "", size = 48 }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="skullGradient" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </radialGradient>
        <filter id="skullShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Skull main shape */}
      <ellipse
        cx="50"
        cy="45"
        rx="28"
        ry="32"
        fill="url(#skullGradient)"
        filter="url(#skullShadow)"
      />
      
      {/* Eye sockets */}
      <ellipse cx="38" cy="40" rx="8" ry="10" fill="#1a1a1a" />
      <ellipse cx="62" cy="40" rx="8" ry="10" fill="#1a1a1a" />
      
      {/* Eye glows */}
      <circle cx="38" cy="38" r="2" fill="#ff0000" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="62" cy="38" r="2" fill="#ff0000" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="2s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </circle>
      
      {/* Nasal cavity */}
      <path
        d="M 50 48 L 46 56 L 50 58 L 54 56 Z"
        fill="#1a1a1a"
      />
      
      {/* Teeth */}
      <rect x="42" y="62" width="4" height="6" fill="#f0f0f0" />
      <rect x="48" y="62" width="4" height="6" fill="#f0f0f0" />
      <rect x="54" y="62" width="4" height="6" fill="#f0f0f0" />
      
      {/* Jaw */}
      <rect x="40" y="60" width="20" height="3" fill="#d0d0d0" />
      
      {/* Crossbones */}
      <g transform="translate(50, 80)">
        <rect x="-20" y="-2" width="40" height="4" rx="2" fill="#e0e0e0" transform="rotate(45)" />
        <rect x="-20" y="-2" width="40" height="4" rx="2" fill="#e0e0e0" transform="rotate(-45)" />
        <circle cx="-18" cy="0" r="3" fill="#e0e0e0" transform="rotate(45)" />
        <circle cx="18" cy="0" r="3" fill="#e0e0e0" transform="rotate(45)" />
        <circle cx="-18" cy="0" r="3" fill="#e0e0e0" transform="rotate(-45)" />
        <circle cx="18" cy="0" r="3" fill="#e0e0e0" transform="rotate(-45)" />
      </g>
    </svg>
  );
}