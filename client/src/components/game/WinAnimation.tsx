import { useEffect, useState } from 'react';

interface WinAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export function WinAnimation({ amount, onComplete }: WinAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible || amount === 0) return null;

  const getWinTier = () => {
    if (amount >= 100) return 'jackpot';
    if (amount >= 50) return 'big';
    if (amount >= 20) return 'medium';
    return 'small';
  };

  const tier = getWinTier();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className={`
        transform transition-all duration-300
        ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
      `}>
        {/* Main win display */}
        <div className={`
          relative rounded-2xl shadow-2xl p-8
          ${tier === 'jackpot' ? 'bg-gold-600 animate-pulse border-4 border-gold-400' : ''}
          ${tier === 'big' ? 'bg-gold-700 border-2 border-gold-500' : ''}
          ${tier === 'medium' ? 'bg-navy-500 border-2 border-gold-600' : ''}
          ${tier === 'small' ? 'bg-navy-600 border border-gold-600/50' : ''}
        `}>
          <div className="text-center">
            <div className="text-cream-100 text-6xl font-bold mb-4 animate-bounce">
              ${amount}
            </div>
            <div className="text-cream-100 text-2xl font-semibold">
              {tier === 'jackpot' && '🎉 JACKPOT! 🎉'}
              {tier === 'big' && '💰 BIG WIN! 💰'}
              {tier === 'medium' && '🎊 Nice Win! 🎊'}
              {tier === 'small' && '✨ Winner! ✨'}
            </div>
          </div>
        </div>

        {/* Floating coins animation */}
        {tier === 'jackpot' && (
          <>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute text-6xl animate-float-up"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                💰
              </div>
            ))}
          </>
        )}

        {/* Sparkles for other wins */}
        {tier !== 'jackpot' && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-sparkle"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                }}
              >
                ✨
              </div>
            ))}
          </>
        )}
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
        }

        .animate-float-up {
          animation: float-up 3s ease-in-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}