import { useState } from "react";
import { SymbolDisplay } from "./SymbolDisplay";

interface TabComponentProps {
    tabNumber: number;
    symbols: number[];
    isRevealed: boolean;
    isWinning: boolean;
    onReveal: (tabNumber: number) => void;
    disabled?: boolean;
}

export function TabComponent({
    tabNumber,
    symbols,
    isRevealed,
    isWinning,
    onReveal,
    disabled = false,
}: TabComponentProps) {
    const [isPeeling, setIsPeeling] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleClick = () => {
        if (isRevealed || disabled || isPeeling) return;
        
        // Trigger peel animation on click
        setIsPeeling(true);
        setTimeout(() => {
            onReveal(tabNumber);
            setIsPeeling(false);
        }, 800);
    };

    return (
        <div className="relative">
            {/* Symbols underneath */}
            <div className="flex gap-3 p-3 bg-navy-800/30 rounded-lg border border-navy-600/30">
                {symbols.map((symbolId, index) => (
                    <SymbolDisplay
                        key={`${tabNumber}-${index}`}
                        symbolId={symbolId}
                        isRevealed={isRevealed}
                        isWinning={isWinning}
                        size="medium"
                    />
                ))}
            </div>

            {/* Peelable tab overlay */}
            {!isRevealed && (
                <div
                    className={`
                        absolute inset-0 rounded-lg cursor-pointer
                        ${isPeeling ? 'tab-peel-animation pointer-events-none' : ''}
                        ${!isPeeling && isHovering ? 'hover-lift' : ''}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        select-none transition-transform duration-200
                    `}
                    style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "left center",
                    }}
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Shadow layer */}
                    <div 
                        className="absolute inset-0 rounded-lg"
                        style={{
                            boxShadow: isHovering && !isPeeling
                                ? '4px 4px 12px rgba(0,0,0,0.2)'
                                : '2px 2px 6px rgba(0,0,0,0.1)',
                            transition: 'box-shadow 0.2s ease-out',
                        }}
                    />

                    {/* Tab background with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-600 to-gold-700 rounded-lg" />

                    {/* Perforated edges on all sides */}
                    <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                        {/* Top perforation */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)",
                            }}
                        />
                        {/* Bottom perforation */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-1"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)",
                            }}
                        />
                        {/* Left perforation */}
                        <div
                            className="absolute top-0 bottom-0 left-0 w-1"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)",
                            }}
                        />
                        {/* Right perforation */}
                        <div
                            className="absolute top-0 bottom-0 right-0 w-1"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)",
                            }}
                        />
                    </div>

                    {/* Metallic foil effect */}
                    <div className="absolute inset-0 rounded-lg opacity-20 bg-gradient-to-tr from-cream-100 via-transparent to-cream-100 pointer-events-none" />

                    {/* Tab content */}
                    <div className="relative text-center z-10 pointer-events-none">
                        <div className="text-cream-100 font-bold text-lg drop-shadow-lg mt-4">
                            TAB {tabNumber}
                        </div>
                        <div className="text-amber-100/90 text-xs mt-1 font-semibold">
                            CLICK TO REVEAL
                        </div>
                    </div>

                    {/* Paper texture overlay */}
                    <div className="absolute inset-0 rounded-lg opacity-10 pointer-events-none">
                        <svg width="100%" height="100%">
                            <filter id={`texture-${tabNumber}`}>
                                <feTurbulence
                                    baseFrequency="0.04"
                                    numOctaves="5"
                                    result="noise"
                                    seed={tabNumber}
                                />
                                <feColorMatrix
                                    in="noise"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                                />
                            </filter>
                            <rect width="100%" height="100%" filter={`url(#texture-${tabNumber})`} />
                        </svg>
                    </div>

                    {/* Hover hint - right edge lift */}
                    {isHovering && !isPeeling && (
                        <div className="absolute top-0 right-0 bottom-0 w-8">
                            <div 
                                className="absolute inset-0 bg-gradient-to-l from-gold-500/30 to-transparent rounded-r-lg"
                            />
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .hover-lift {
                    transform: rotateY(5deg) translateX(2px);
                }

                .tab-peel-animation {
                    animation: peelRightToLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes peelRightToLeft {
                    0% {
                        transform: rotateY(0deg) translateX(0) scaleX(1);
                        opacity: 1;
                    }
                    20% {
                        transform: rotateY(15deg) translateX(5px) scaleX(1.02);
                    }
                    50% {
                        transform: rotateY(60deg) translateX(20px) scaleX(1.05);
                        opacity: 0.8;
                    }
                    80% {
                        transform: rotateY(85deg) translateX(40px) scaleX(0.95);
                        opacity: 0.3;
                    }
                    100% {
                        transform: rotateY(90deg) translateX(60px) scaleX(0.8);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}