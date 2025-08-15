interface SymbolProps {
  className?: string;
  size?: number;
}

export function CompassSymbol({ className = "", size = 48 }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="compassBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#F5DEB3" />
          <stop offset="100%" stopColor="#D2691E" />
        </radialGradient>
        <linearGradient id="needleRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF0000" />
          <stop offset="100%" stopColor="#8B0000" />
        </linearGradient>
        <linearGradient id="needleBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4169E1" />
          <stop offset="100%" stopColor="#00008B" />
        </linearGradient>
        <filter id="compassShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.5" />
        </filter>
      </defs>
      
      {/* Outer ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="url(#compassBg)"
        stroke="#8B4513"
        strokeWidth="3"
        filter="url(#compassShadow)"
      />
      
      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="#FFFAF0"
        stroke="#8B4513"
        strokeWidth="1"
      />
      
      {/* Cardinal directions */}
      <text x="50" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8B4513">N</text>
      <text x="50" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8B4513">S</text>
      <text x="15" y="54" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8B4513">W</text>
      <text x="85" y="54" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8B4513">E</text>
      
      {/* Degree markings */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="18"
          x2="50"
          y2="22"
          stroke="#8B4513"
          strokeWidth="1"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      
      {/* Compass needle - animated rotation */}
      <g transform="translate(50, 50)" filter="url(#compassShadow)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0;5;0;-5;0"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
        />
        
        {/* North needle (red) */}
        <polygon
          points="0,-25 -6,0 0,-5 6,0"
          fill="url(#needleRed)"
        />
        
        {/* South needle (blue) */}
        <polygon
          points="0,25 -6,0 0,5 6,0"
          fill="url(#needleBlue)"
        />
        
        {/* Center pivot */}
        <circle cx="0" cy="0" r="4" fill="#FFD700" />
        <circle cx="0" cy="0" r="2" fill="#8B4513" />
      </g>
      
      {/* Decorative compass rose */}
      <g transform="translate(50, 50)" opacity="0.3">
        <polygon points="0,-30 3,-3 30,0 3,3 0,30 -3,3 -30,0 -3,-3" fill="#8B4513" />
        <polygon 
          points="0,-30 3,-3 30,0 3,3 0,30 -3,3 -30,0 -3,-3" 
          fill="#8B4513"
          transform="rotate(45)"
        />
      </g>
      
      {/* Glass reflection effect */}
      <ellipse
        cx="45"
        cy="35"
        rx="15"
        ry="10"
        fill="#FFFFFF"
        opacity="0.3"
      />
    </svg>
  );
}