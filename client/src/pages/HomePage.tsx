import { FaDice, FaDiceD6, FaGem, FaHandPointer, FaTicketAlt } from "react-icons/fa";
import { GiCardExchange, GiOpenTreasureChest } from "react-icons/gi";
import { Link } from "react-router-dom";
import { OceanBackground } from "../components/layout/OceanBackground";
import { useAuth } from "../hooks/useAuth";

export function HomePage() {
    const { user } = useAuth();

    const playSteps = [
        {
            icon: <FaTicketAlt className="text-4xl text-gold-400" />,
            title: "Buy Ticket",
            description: "Purchase a ticket for $1",
            step: 1,
        },
        {
            icon: <GiCardExchange className="text-4xl text-gold-400" />,
            title: "Flip Card",
            description: "Click to reveal the tabs",
            step: 2,
        },
        {
            icon: <FaHandPointer className="text-4xl text-gold-400" />,
            title: "Pull Tabs",
            description: "Click each tab to uncover symbols",
            step: 3,
        },
        {
            icon: <GiOpenTreasureChest className="text-4xl text-gold-400" />,
            title: "Win Prizes",
            description: "Match patterns to win up to $100!",
            step: 4,
        },
    ];

    return (
        <div className="py-8 relative">
            <OceanBackground variant="waves" intensity="subtle" />

            {/* Hero Section */}
            <div className="text-center text-cream-100 mb-16 relative z-10">
                <div className="relative inline-block">
                    <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 drop-shadow-lg">
                        Welcome to Pull Tabs Treasure!
                    </h1>
                    {/* Floating coins decoration */}
                    {/* <FaCoins className="absolute -top-8 -left-12 text-3xl text-gold-400/40 animate-float" />
                    <FaTrophy
                        className="absolute -top-8 -right-12 text-3xl text-gold-400/40 animate-float"
                        style={{ animationDelay: "1s" }}
                    /> */}
                </div>
                {/* <p className="text-xl text-cream-100/80 mt-4">
                    Uncover the treasure, one tab at a time
                </p> */}
            </div>

            {/* How to Play Section */}
            <div className="max-w-6xl mx-auto mb-16 relative z-10">
                <h2 className="text-3xl font-bold text-gold-400 text-center mb-10">How to Play</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {playSteps.map((step, index) => (
                        <div key={index} className="group relative">
                            {/* Card with hover effect */}
                            <div className="relative bg-navy-600/90 backdrop-blur-sm rounded-lg shadow-xl p-6 border-2 border-gold-600/30 h-full">
                                {/* Step number badge */}
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center font-black text-navy-900 shadow-lg">
                                    {step.step}
                                </div>

                                {/* Corner decorations */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-400/50 rounded-tl-lg" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-400/50 rounded-tr-lg" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-400/50 rounded-bl-lg" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-400/50 rounded-br-lg" />

                                {/* Content */}
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div>
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-cream-100">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-cream-100/70">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="max-w-4xl mx-auto mb-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-center items-center gap-16 text-center">
                    <div className="flex items-center gap-3">
                        <FaGem className="text-4xl text-gold-400 animate-pulse" />
                        <div>
                            <p className="text-3xl font-bold text-gold-400">$100</p>
                            <p className="text-md text-cream-100/60">Top Prize</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaTicketAlt
                            className="text-4xl text-gold-400 animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                        />
                        <div>
                            <p className="text-3xl font-bold text-gold-400">$1</p>
                            <p className="text-md text-cream-100/60">Per Ticket</p>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-3">
                        <FaTrophy className="text-3xl text-gold-400 animate-pulse" style={{ animationDelay: "1s" }} />
                        <div>
                            <p className="text-2xl font-bold text-gold-400">5 Tabs</p>
                            <p className="text-sm text-cream-100/60">To Reveal</p>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center relative z-10">
                {user ? (
                    <div className="relative inline-block group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-gold-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                        <Link
                            to="/game"
                            className="relative inline-flex items-center gap-3 bg-gradient-to-r from-gold-500 via-yellow-400 to-gold-500 text-navy-900 px-12 py-5 rounded-lg text-xl font-black transform transition-all hover:scale-105 hover:shadow-2xl"
                            style={{
                                backgroundSize: "200% 100%",
                                backgroundPosition: "0% 50%",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundPosition = "100% 50%")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundPosition = "0% 50%")
                            }
                        >
                            <FaDice className="text-xl" />
                            Start Playing
                            <FaDiceD6 className="text-xl" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/login"
                            className="bg-gold-600 hover:bg-gold-700 text-cream-100 px-8 py-4 rounded-lg text-xl font-bold transform transition-all hover:scale-105 hover:shadow-xl"
                        >
                            Login to Play
                        </Link>
                        <Link
                            to="/register"
                            className="bg-navy-500 hover:bg-navy-400 text-cream-100 px-8 py-4 rounded-lg text-xl font-bold transform transition-all hover:scale-105 hover:shadow-xl border border-navy-400"
                        >
                            Create Account
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
