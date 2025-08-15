interface SymbolProps {
  className?: string;
  size?: number;
}

export function MapSymbol({ className = "", size = 48 }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5DEB3" />
          <stop offset="50%" stopColor="#FAEBD7" />
          <stop offset="100%" stopColor="#DEB887" />
        </linearGradient>
        <filter id="mapAge">
          <feTurbulence baseFrequency="0.02" numOctaves="5" result="noise" seed="1" />
          <feColorMatrix in="noise" type="matrix" 
            values="0 0 0 0 0.9
                    0 0 0 0 0.85
                    0 0 0 0 0.7
                    0 0 0 1 0" />
          <feComposite operator="multiply" in2="SourceGraphic" />
        </filter>
        <filter id="mapShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Rolled map edges */}
      <path
        d="M 15 20 Q 10 20 10 25 L 10 75 Q 10 80 15 80 L 85 80 Q 90 80 90 75 L 90 25 Q 90 20 85 20 Z"
        fill="url(#mapGradient)"
        filter="url(#mapShadow)"
      />
      
      {/* Map surface with aged effect */}
      <rect
        x="15"
        y="25"
        width="70"
        height="50"
        fill="url(#mapGradient)"
        filter="url(#mapAge)"
      />
      
      {/* Island shapes */}
      <g opacity="0.7">
        <ellipse cx="30" cy="40" rx="8" ry="6" fill="#8FBC8F" />
        <polygon points="60,35 65,40 62,45 55,43 58,37" fill="#8FBC8F" />
        <circle cx="70" cy="55" r="5" fill="#8FBC8F" />
      </g>
      
      {/* Dotted path */}
      <path
        d="M 25 50 Q 40 35 60 40 T 75 50"
        fill="none"
        stroke="#8B0000"
        strokeWidth="2"
        strokeDasharray="2,3"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;5"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* X marks the spot */}
      <g transform="translate(75, 50)">
        <line x1="-5" y1="-5" x2="5" y2="5" stroke="#FF0000" strokeWidth="3" strokeLinecap="round" />
        <line x1="-5" y1="5" x2="5" y2="-5" stroke="#FF0000" strokeWidth="3" strokeLinecap="round" />
        <circle cx="0" cy="0" r="8" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.5">
          <animate
            attributeName="r"
            values="8;12;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.2;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
      
      {/* Compass rose on map */}
      <g transform="translate(25, 60)" opacity="0.6">
        <circle cx="0" cy="0" r="8" fill="none" stroke="#8B4513" strokeWidth="1" />
        <path d="M 0,-8 L 2,0 L 0,8 L -2,0 Z" fill="#8B4513" />
        <path d="M -8,0 L 0,-2 L 8,0 L 0,2 Z" fill="#8B4513" />
        <text x="0" y="-10" textAnchor="middle" fontSize="6" fill="#8B4513">N</text>
      </g>
      
      {/* Palm tree */}
      <g transform="translate(30, 40)">
        <rect x="-1" y="0" width="2" height="8" fill="#8B4513" />
        <path d="M 0,-2 Q -5,-3 -6,-1" fill="none" stroke="#228B22" strokeWidth="1" />
        <path d="M 0,-2 Q 5,-3 6,-1" fill="none" stroke="#228B22" strokeWidth="1" />
        <path d="M 0,-2 Q -3,-5 -2,-6" fill="none" stroke="#228B22" strokeWidth="1" />
        <path d="M 0,-2 Q 3,-5 2,-6" fill="none" stroke="#228B22" strokeWidth="1" />
      </g>
      
      {/* Ship icon */}
      <g transform="translate(45, 45)">
        <path d="M -3,0 L 3,0 L 2,3 L -2,3 Z" fill="#8B4513" />
        <polygon points="0,-5 -2,0 2,0" fill="#FFFFFF" />
      </g>
      
      {/* Burn marks on edges */}
      <circle cx="20" cy="30" r="3" fill="#8B4513" opacity="0.2" />
      <circle cx="80" cy="70" r="4" fill="#8B4513" opacity="0.15" />
      <circle cx="82" cy="28" r="2.5" fill="#8B4513" opacity="0.2" />
    </svg>
  );
}