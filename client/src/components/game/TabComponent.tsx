import { useRef, useState } from "react";
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
    const [isDragging, setIsDragging] = useState(false);
    const [dragProgress, setDragProgress] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const hasDraggedRef = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isRevealed || disabled || isPeeling) return;
        
        setIsDragging(true);
        hasDraggedRef.current = false;
        setDragProgress(0); // Reset drag progress on new interaction
        startPosRef.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || isRevealed || disabled) return;

        // Calculate horizontal drag distance (right to left - negative deltaX)
        const deltaX = startPosRef.current.x - e.clientX;
        
        // Only start peeling after minimum threshold (increased for less sensitivity)
        if (deltaX > 20) {
            hasDraggedRef.current = true;
            // Map drag distance to progress (0-100)
            const progress = Math.min(100, (deltaX / 80) * 100);
            setDragProgress(progress);
            
            // Auto-complete if dragged far enough
            if (progress >= 100) {
                completePeel();
            }
        }
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        
        if (dragProgress >= 60) {
            // Complete the peel if dragged more than 60%
            completePeel();
        } else if (hasDraggedRef.current) {
            // Spring back if not dragged enough
            setDragProgress(0);
        }
        
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        if (isDragging && dragProgress < 60) {
            setDragProgress(0);
        }
        setIsDragging(false);
        setIsHovering(false);
    };

    const handleClick = () => {
        // Only trigger click animation if not dragging
        if (isRevealed || disabled || isPeeling || hasDraggedRef.current) return;
        
        // Trigger smooth peel animation on click
        setIsPeeling(true);
        setTimeout(() => {
            onReveal(tabNumber);
            setIsPeeling(false);
        }, 800);
    };

    const completePeel = () => {
        setIsPeeling(true);
        setDragProgress(100);
        setTimeout(() => {
            onReveal(tabNumber);
            setIsPeeling(false);
            setDragProgress(0);
        }, 300);
    };

    // Calculate staged transform for drag interaction
    const getDragTransform = () => {
        if (dragProgress > 0) {
            // Create distinct stages for choppy animation
            const stage = Math.floor(dragProgress / 20); // 5 stages (0-4)
            const stageProgress = (stage * 20) / 100;
            
            const rotateY = 90 * stageProgress;
            const translateX = 60 * stageProgress;
            const scaleX = 1 - (0.2 * stageProgress);
            return `rotateY(${rotateY}deg) translateX(${translateX}px) scaleX(${scaleX})`;
        }
        
        if (isHovering && !isDragging && !isPeeling) {
            return "rotateY(5deg) translateX(2px)";
        }
        
        return "";
    };

    const getOpacity = () => {
        if (dragProgress > 0) {
            // Match opacity to staged animation
            const stage = Math.floor(dragProgress / 20);
            const stageProgress = (stage * 20) / 100;
            return Math.max(0, 1 - stageProgress);
        }
        return 1;
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
                        absolute inset-0 rounded-lg
                        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                        ${isPeeling && !isDragging ? 'smooth-peel-animation pointer-events-none' : ''}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        select-none
                    `}
                    style={{
                        transform: isDragging || (isHovering && !isPeeling) ? getDragTransform() : undefined,
                        opacity: isDragging ? getOpacity() : undefined,
                        transformStyle: "preserve-3d",
                        transformOrigin: "left center",
                        transition: isDragging ? 'none' : (isHovering ? 'transform 0.2s ease-out' : 'none'),
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={() => setIsHovering(true)}
                    onClick={handleClick}
                >
                    {/* Dynamic shadow based on interaction */}
                    <div 
                        className="absolute inset-0 rounded-lg"
                        style={{
                            boxShadow: isDragging || isPeeling
                                ? `${4 + (dragProgress || 0) / 10}px ${4 + (dragProgress || 0) / 10}px ${12 + (dragProgress || 0) / 5}px rgba(0,0,0,${0.2 - (dragProgress || 0) / 500})`
                                : (isHovering ? '4px 4px 12px rgba(0,0,0,0.2)' : '2px 2px 6px rgba(0,0,0,0.1)'),
                            transition: isDragging ? 'none' : 'box-shadow 0.2s ease-out',
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
                            {isDragging ? '← DRAG LEFT' : 'CLICK OR DRAG'}
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

                    {/* Hover hint - right edge lift for left drag */}
                    {isHovering && !isDragging && !isPeeling && (
                        <div className="absolute top-0 right-0 bottom-0 w-8">
                            <div 
                                className="absolute inset-0 bg-gradient-to-l from-gold-500/30 to-transparent rounded-r-lg"
                            />
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .smooth-peel-animation {
                    animation: smoothPeelRightToLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes smoothPeelRightToLeft {
                    0% {
                        transform: rotateY(0deg) translateX(0) scaleX(1);
                        opacity: 1;
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