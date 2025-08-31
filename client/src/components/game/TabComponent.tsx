import { useEffect, useRef, useState } from "react";
import { SymbolDisplay } from "./SymbolDisplay";

interface TabComponentProps {
    tabNumber: number;
    symbols: number[];
    isRevealed: boolean;
    isWinning: boolean;
    onReveal: (tabNumber: number) => void;
    disabled?: boolean;
    size?: "small" | "medium";
}

export function TabComponent({
    tabNumber,
    symbols,
    isRevealed,
    isWinning,
    onReveal,
    disabled = false,
    size = "medium",
}: TabComponentProps) {
    const [isPeeling, setIsPeeling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragProgress, setDragProgress] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const hasDraggedRef = useRef(false);
    const dragProgressRef = useRef(0);
    const cleanupRef = useRef<(() => void) | null>(null);

    // Cleanup function for removing event listeners
    const cleanupDragListeners = () => {
        if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupDragListeners();
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Ensure Chromium doesn't start native drag
        if (isRevealed || disabled || isPeeling) return;

        // Reset state
        hasDraggedRef.current = false;
        dragProgressRef.current = 0;
        setDragProgress(0);
        startPosRef.current = { x: e.clientX, y: e.clientY };

        // Define event handlers
        const handleDocumentMouseMove = (e: MouseEvent) => {
            if (isRevealed || disabled) return;

            const deltaX = e.clientX - startPosRef.current.x;
            if (Math.abs(deltaX) > 5) {
                hasDraggedRef.current = true;
            }

            if (deltaX < -10) {
                const progress = Math.min(100, (Math.abs(deltaX) / 350) * 100);
                dragProgressRef.current = progress;
                setDragProgress(progress);
                if (progress >= 100) {
                    completePeel();
                    cleanupDragListeners();
                }
            } else {
                dragProgressRef.current = 0;
                setDragProgress(0);
            }
        };

        const handleDocumentMouseUp = () => {
            if (dragProgressRef.current >= 75) {
                completePeel();
            } else if (hasDraggedRef.current) {
                setDragProgress(0);
            }
            setIsDragging(false);
            cleanupDragListeners();
        };

        // Attach listeners immediately (fixes Chromium issue)
        document.addEventListener("mousemove", handleDocumentMouseMove);
        document.addEventListener("mouseup", handleDocumentMouseUp);

        // Store cleanup function
        cleanupRef.current = () => {
            document.removeEventListener("mousemove", handleDocumentMouseMove);
            document.removeEventListener("mouseup", handleDocumentMouseUp);
        };

        // Set dragging state after listeners are attached
        setIsDragging(true);
    };

    const handleMouseLeave = () => setIsHovering(false);

    const handleClick = () => {
        if (isRevealed || disabled || isPeeling || hasDraggedRef.current) return;
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

    const getDragTransform = () => {
        if (dragProgress > 0) {
            const rotateY = 90 * (dragProgress / 100);
            const scaleX = 1 - 0.15 * (dragProgress / 100);
            return `rotateY(${rotateY}deg) translateX(0px) scaleX(${scaleX})`;
        }
        if (isHovering && !isDragging && !isPeeling) {
            return "rotateY(5deg) translateX(2px)";
        }
        return "";
    };

    const getOpacity = () => dragProgress > 0 ? Math.max(0, 1 - dragProgress / 100) : 1;

    const symbolSize = size === "small" ? "small" : "medium";
    const gap = "gap-2";
    const containerPadding = "p-2";

    return (
        <div className="relative">
            <div className={`flex ${gap} ${containerPadding} bg-navy-800/30 rounded-lg border border-navy-600/30`}>
                {symbols.map((symbolId, index) => (
                    <SymbolDisplay
                        key={`${tabNumber}-${index}`}
                        symbolId={symbolId}
                        isRevealed={isRevealed}
                        isWinning={isWinning}
                        size={symbolSize}
                    />
                ))}
            </div>

            {!isRevealed && (
                <div
                    draggable={false}
                    className={`
                        absolute inset-0 rounded-lg no-drag
                        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
                        ${isPeeling && !isDragging ? "smooth-peel-animation pointer-events-none" : ""}
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                        select-none
                    `}
                    style={{
                        transform: isDragging || (isHovering && !isPeeling) ? getDragTransform() : undefined,
                        opacity: isDragging ? getOpacity() : undefined,
                        transformStyle: "preserve-3d",
                        transformOrigin: "left center",
                        transition: isDragging
                            ? "none"
                            : isHovering
                            ? "transform 0.2s ease-out"
                            : dragProgress > 0
                            ? "all 0.3s ease-out"
                            : "none",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={() => setIsHovering(true)}
                    onClick={handleClick}
                >
                    <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                            boxShadow: isDragging || isPeeling
                                ? `${4 + (dragProgress || 0) / 10}px ${4 + (dragProgress || 0) / 10}px ${12 + (dragProgress || 0) / 5}px rgba(0,0,0,${0.2 - (dragProgress || 0) / 500})`
                                : isHovering
                                ? "4px 4px 12px rgba(0,0,0,0.2)"
                                : "2px 2px 6px rgba(0,0,0,0.1)",
                            transition: isDragging ? "none" : "box-shadow 0.2s ease-out",
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-gold-600 to-gold-700 rounded-lg" />

                    <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)" }} />
                        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)" }} />
                        <div className="absolute top-0 bottom-0 left-0 w-0.5" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)" }} />
                        <div className="absolute top-0 bottom-0 right-0 w-2" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px)" }} />
                    </div>

                    <div className="absolute inset-0 rounded-lg opacity-20 bg-gradient-to-tr from-cream-100 via-transparent to-cream-100 pointer-events-none" />

                    <div className="relative text-center z-10 pointer-events-none">
                        <div className="text-cream-100 font-bold text-lg drop-shadow-lg mt-4">TAB {tabNumber}</div>
                        <div className="text-amber-100/90 text-xs mt-1 font-semibold">{isDragging ? "← DRAG LEFT" : "CLICK OR DRAG"}</div>
                    </div>

                    {!isDragging && (
                        <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center pointer-events-none">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-l from-cream-100/30 to-transparent rounded-l-lg animate-pulse" />
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-0 rounded-lg opacity-10 pointer-events-none">
                        <svg width="100%" height="100%">
                            <filter id={`texture-${tabNumber}`}>
                                <feTurbulence baseFrequency="0.04" numOctaves="5" result="noise" seed={tabNumber} />
                                <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                            </filter>
                            <rect width="100%" height="100%" filter={`url(#texture-${tabNumber})`} />
                        </svg>
                    </div>

                    {isHovering && !isDragging && !isPeeling && (
                        <div className="absolute top-0 right-0 bottom-0 w-8 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-l from-gold-500/30 to-transparent rounded-r-lg" />
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .no-drag {
                    -webkit-user-drag: none;
                    user-drag: none;
                }
                .smooth-peel-animation {
                    animation: smoothPeelRightToLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                @keyframes smoothPeelRightToLeft {
                    0% {
                        transform: rotateY(0deg) translateX(0) scaleX(1);
                        opacity: 1;
                    }
                    100% {
                        transform: rotateY(90deg) translateX(0) scaleX(0.8);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
