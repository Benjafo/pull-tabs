import { useEffect, useState } from 'react';

interface EnhancedWinAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export function EnhancedWinAnimation({ amount, onComplete }: EnhancedWinAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti for big wins
    if (amount >= 20) {
      setShowConfetti(true);
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    }, amount >= 100 ? 5000 : 3000); // Longer duration for jackpot

    return () => clearTimeout(timer);
  }, [amount, onComplete]);

  if (!isVisible || amount === 0) return null;

  const getWinTier = () => {
    if (amount >= 100) return 'jackpot';
    if (amount >= 50) return 'big';
    if (amount >= 20) return 'medium';
    return 'small';
  };

  const tier = getWinTier();

  return (
    <>
      {/* Screen shake for jackpot */}
      {tier === 'jackpot' && (
        <div className="fixed inset-0 screen-shake pointer-events-none" />
      )}

      {/* Main win display */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
        <div className={`
          transform transition-all duration-300
          ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          ${tier === 'jackpot' ? 'treasure-bounce' : ''}
        `}>
          {/* Glowing backdrop */}
          <div className={`
            absolute -inset-20 rounded-full blur-3xl
            ${tier === 'jackpot' ? 'bg-yellow-400/50 pulse-glow' : ''}
            ${tier === 'big' ? 'bg-purple-500/40' : ''}
            ${tier === 'medium' ? 'bg-blue-500/30' : ''}
            ${tier === 'small' ? 'bg-green-500/20' : ''}
          `} />
          
          {/* Win card */}
          <div className={`
            relative bg-gradient-to-br rounded-2xl shadow-2xl p-8 border-4
            ${tier === 'jackpot' ? 'from-yellow-400 via-amber-500 to-orange-600 border-yellow-300 pulse-glow' : ''}
            ${tier === 'big' ? 'from-purple-500 to-pink-600 border-purple-300' : ''}
            ${tier === 'medium' ? 'from-blue-500 to-cyan-600 border-blue-300' : ''}
            ${tier === 'small' ? 'from-green-500 to-emerald-600 border-green-300' : ''}
          `}>
            {/* Treasure chest for jackpot */}
            {tier === 'jackpot' && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <rect x="20" y="50" width="60" height="35" rx="3" fill="#8B4513" />
                  <path d="M 20 50 Q 50 30 80 50 L 80 55 Q 50 35 20 55 Z" fill="#654321" />
                  <rect x="45" y="60" width="10" height="12" rx="1" fill="#FFD700" />
                </svg>
              </div>
            )}
            
            <div className="text-center relative z-10">
              {/* Amount display */}
              <div className="text-white font-bold mb-4">
                <span className="text-6xl drop-shadow-lg">${amount}</span>
              </div>
              
              {/* Win message */}
              <div className="text-white text-2xl font-bold uppercase tracking-wider">
                {tier === 'jackpot' && (
                  <div>
                    <div className="text-4xl mb-2">JACKPOT!</div>
                    <div className="text-lg">Legendary Treasure Found!</div>
                  </div>
                )}
                {tier === 'big' && 'BIG WIN!'}
                {tier === 'medium' && 'Nice Win!'}
                {tier === 'small' && 'Winner!'}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 text-4xl animate-spin-slow">⭐</div>
            <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-spin-slow" style={{ animationDelay: '1s' }}>⭐</div>
            <div className="absolute -bottom-4 -right-4 text-4xl animate-spin-slow" style={{ animationDelay: '1.5s' }}>⭐</div>
          </div>
        </div>

        {/* Floating coins for jackpot */}
        {tier === 'jackpot' && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={`coin-${i}`}
                className="absolute text-6xl coin-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                💰
              </div>
            ))}
          </div>
        )}

        {/* Confetti for medium+ wins */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(tier === 'jackpot' ? 50 : 30)].map((_, i) => {
              const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98', '#DDA0DD'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              return (
                <div
                  key={`confetti-${i}`}
                  className="absolute confetti-fall"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                >
                  <div 
                    className="w-2 h-3"
                    style={{
                      backgroundColor: color,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Sparkles for all wins */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(tier === 'jackpot' ? 20 : 10)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-3xl sparkle-effect"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      </div>
    </>
  );
}