interface OceanBackgroundProps {
    variant?: "waves" | "mesh" | "minimal";
    intensity?: "subtle" | "medium" | "strong";
}

export function OceanBackground({ 
    variant = "waves", 
    intensity = "subtle" 
}: OceanBackgroundProps) {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Vignette effect */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-navy-900/50" />
            
            {/* Light rays from top */}
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-gold-400/[0.02] via-transparent to-transparent" />
            
            {/* Geometric mesh pattern */}
            <svg 
                className="absolute inset-0 w-full h-full opacity-[0.02]"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path 
                            d="M 60 0 L 30 30 L 0 0 M 30 30 L 60 60 L 30 60 L 0 60 L 30 30" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="0.5"
                            className="text-gold-400"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Layered animated waves */}
            {variant === "waves" && (
                <>
                    {/* Wave Layer 1 - Back */}
                    <div className="absolute bottom-0 left-0 w-full h-96 opacity-[0.03]">
                        <svg 
                            className="absolute bottom-0 w-[200%] h-full animate-wave-slow"
                            preserveAspectRatio="none"
                            viewBox="0 0 1440 320"
                        >
                            <path 
                                fill="currentColor" 
                                className="text-blue-500"
                                d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,218.7C840,235,960,245,1080,234.7C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                            />
                        </svg>
                    </div>

                    {/* Wave Layer 2 - Middle */}
                    <div className="absolute bottom-0 left-0 w-full h-80 opacity-[0.02]">
                        <svg 
                            className="absolute bottom-0 w-[200%] h-full animate-wave-medium"
                            preserveAspectRatio="none"
                            viewBox="0 0 1440 320"
                        >
                            <path 
                                fill="currentColor" 
                                className="text-indigo-400"
                                d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            />
                        </svg>
                    </div>

                    {/* Wave Layer 3 - Front */}
                    <div className="absolute bottom-0 left-0 w-full h-64 opacity-[0.015]">
                        <svg 
                            className="absolute bottom-0 w-[200%] h-full animate-wave-fast"
                            preserveAspectRatio="none"
                            viewBox="0 0 1440 320"
                        >
                            <path 
                                fill="currentColor" 
                                className="text-navy-400"
                                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            />
                        </svg>
                    </div>
                </>
            )}

            {/* Radial gradient overlay for depth */}
            <div 
                className="absolute inset-0" 
                style={{
                    background: `radial-gradient(ellipse at top center, transparent 0%, transparent 40%, rgba(15, 23, 42, 0.1) 100%)`
                }}
            />
        </div>
    );
}