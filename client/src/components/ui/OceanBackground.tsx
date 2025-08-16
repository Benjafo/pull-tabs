interface OceanBackgroundProps {
    showAnimatedElements?: boolean;
    intensity?: "subtle" | "medium" | "strong";
}

export function OceanBackground({ 
    showAnimatedElements = true, 
    intensity = "subtle" 
}: OceanBackgroundProps) {
    const opacityMap = {
        subtle: "opacity-[0.03]",
        medium: "opacity-[0.06]",
        strong: "opacity-[0.1]"
    };

    return (
        <>
            {showAnimatedElements && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute inset-0 ${opacityMap[intensity]}`}>
                        <div 
                            className="absolute top-[10%] left-[5%] text-6xl animate-float"
                            style={{ animationDelay: "0s", animationDuration: "20s" }}
                        >
                            💰
                        </div>
                        <div 
                            className="absolute top-[60%] right-[10%] text-8xl animate-float"
                            style={{ animationDelay: "3s", animationDuration: "25s" }}
                        >
                            🏴‍☠️
                        </div>
                        <div 
                            className="absolute bottom-[30%] left-[20%] text-7xl animate-float"
                            style={{ animationDelay: "7s", animationDuration: "22s" }}
                        >
                            💎
                        </div>
                        <div 
                            className="absolute top-[35%] right-[30%] text-5xl animate-float"
                            style={{ animationDelay: "5s", animationDuration: "18s" }}
                        >
                            🪙
                        </div>
                        <div 
                            className="absolute bottom-[15%] right-[25%] text-6xl animate-float"
                            style={{ animationDelay: "10s", animationDuration: "24s" }}
                        >
                            ⚓
                        </div>
                        <div 
                            className="absolute top-[80%] left-[40%] text-5xl animate-float"
                            style={{ animationDelay: "12s", animationDuration: "20s" }}
                        >
                            🗺️
                        </div>
                        <div 
                            className="absolute top-[20%] left-[70%] text-6xl animate-float"
                            style={{ animationDelay: "15s", animationDuration: "23s" }}
                        >
                            🧭
                        </div>
                        <div 
                            className="absolute bottom-[50%] left-[60%] text-7xl animate-float"
                            style={{ animationDelay: "8s", animationDuration: "26s" }}
                        >
                            ⛵
                        </div>
                    </div>

                    {/* Wave overlay pattern */}
                    <svg 
                        className="absolute bottom-0 left-0 w-full h-64 opacity-[0.02]"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 320"
                    >
                        <path 
                            fill="currentColor" 
                            className="text-blue-400"
                            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                </div>
            )}
        </>
    );
}