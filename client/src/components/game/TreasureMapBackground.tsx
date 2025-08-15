export function TreasureMapBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="aged">
          <feTurbulence baseFrequency="0.02" numOctaves="5" result="noise" seed="1" />
          <feColorMatrix in="noise" type="matrix" 
            values="0 0 0 0 0.9
                    0 0 0 0 0.85
                    0 0 0 0 0.7
                    0 0 0 1 0" />
          <feComposite operator="multiply" in2="SourceGraphic" />
        </filter>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8B7355" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      
      {/* Grid lines */}
      <rect width="400" height="600" fill="url(#grid)" />
      
      {/* Islands */}
      <g opacity="0.3">
        <ellipse cx="100" cy="150" rx="40" ry="30" fill="#8FBC8F" />
        <polygon points="250,100 280,120 270,150 240,140 245,110" fill="#8FBC8F" />
        <circle cx="320" cy="250" r="25" fill="#8FBC8F" />
        <ellipse cx="150" cy="400" rx="50" ry="35" fill="#8FBC8F" />
      </g>
      
      {/* Dotted paths */}
      <path
        d="M 80 500 Q 150 350 200 300 T 300 200 Q 320 150 280 100"
        fill="none"
        stroke="#8B0000"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.4"
      />
      
      {/* Compass rose */}
      <g transform="translate(350, 550)" opacity="0.4">
        <circle cx="0" cy="0" r="30" fill="none" stroke="#8B4513" strokeWidth="2" />
        <path d="M 0,-30 L 5,0 L 0,30 L -5,0 Z" fill="#8B4513" />
        <path d="M -30,0 L 0,-5 L 30,0 L 0,5 Z" fill="#8B4513" />
        <text x="0" y="-35" textAnchor="middle" fontSize="12" fill="#8B4513">N</text>
      </g>
      
      {/* Sea monsters */}
      <g transform="translate(50, 300)" opacity="0.2">
        <path d="M 0,0 Q 10,-10 20,0 Q 30,10 40,0 Q 50,-10 60,0" 
              fill="none" stroke="#4A5568" strokeWidth="2" />
        <circle cx="10" cy="-5" r="2" fill="#4A5568" />
        <circle cx="50" cy="-5" r="2" fill="#4A5568" />
      </g>
      
      {/* Ships */}
      <g transform="translate(200, 450)" opacity="0.3">
        <path d="M -10,0 L 10,0 L 5,10 L -5,10 Z" fill="#8B4513" />
        <polygon points="0,-15 -8,0 8,0" fill="#DEB887" />
      </g>
      
      {/* X marks */}
      <g transform="translate(280, 120)" opacity="0.5">
        <line x1="-10" y1="-10" x2="10" y2="10" stroke="#FF0000" strokeWidth="3" />
        <line x1="-10" y1="10" x2="10" y2="-10" stroke="#FF0000" strokeWidth="3" />
      </g>
      
      {/* Decorative border */}
      <rect x="5" y="5" width="390" height="590" fill="none" 
            stroke="#8B4513" strokeWidth="2" opacity="0.3"
            strokeDasharray="10,5" />
    </svg>
  );
}