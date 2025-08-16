import { Link } from "react-router-dom";
import { FaSkull, FaGem, FaShip, FaAnchor, FaCompass, FaMap, FaDice, FaDiceD6 } from "react-icons/fa";
import { OceanBackground } from "../components/layout/OceanBackground";
import { useAuth } from "../hooks/useAuth";

export function HomePage() {
    const { user } = useAuth();

    return (
        <div className="py-8 relative">
            <OceanBackground variant="waves" intensity="subtle" />
            <div className="text-center text-cream-100 mb-12 relative z-10">
                <h1 className="text-5xl font-bold mb-4 text-gold-400 drop-shadow-lg">
                    Welcome to Pull Tabs Treasure!
                </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12 relative z-10">
                <div className="bg-navy-600/90 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gold-600/30">
                    <h3 className="text-2xl font-bold text-gold-400 mb-4">How to Play</h3>
                    <ul className="space-y-3 text-cream-100">
                        <li className="flex items-start">
                            <span className="text-gold-500 mr-2">•</span>
                            Purchase a ticket
                        </li>
                        <li className="flex items-start">
                            <span className="text-gold-500 mr-2">•</span>
                            Flip the ticket to reveal tabs
                        </li>
                        <li className="flex items-start">
                            <span className="text-gold-500 mr-2">•</span>
                            Pull each tab to uncover symbols
                        </li>
                        <li className="flex items-start">
                            <span className="text-gold-500 mr-2">•</span>
                            Match patterns to win!
                        </li>
                    </ul>
                </div>

                <div className="bg-navy-600/90 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gold-600/30">
                    <h3 className="text-2xl font-bold text-gold-400 mb-4">Prize Table</h3>
                    <ul className="space-y-2">
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100 flex items-center gap-1">
                                <FaSkull className="text-base" />
                                <FaSkull className="text-base" />
                                <FaSkull className="text-base" />
                                <span className="ml-2">Three Skulls</span>
                            </span>
                            <span className="font-bold text-gold-400">$100</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100 flex items-center gap-1">
                                <FaSkull className="text-base" />
                                <FaSkull className="text-base" />
                                <FaGem className="text-base" />
                                <span className="ml-2">Skull-Skull-Treasure</span>
                            </span>
                            <span className="font-bold text-gold-400">$50</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100 flex items-center gap-1">
                                <FaSkull className="text-base" />
                                <FaSkull className="text-base" />
                                <FaShip className="text-base" />
                                <span className="ml-2">Skull-Skull-Ship</span>
                            </span>
                            <span className="font-bold text-gold-400">$20</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100 flex items-center gap-1">
                                <FaSkull className="text-base" />
                                <FaSkull className="text-base" />
                                <FaAnchor className="text-base" />
                                <span className="ml-2">Skull-Skull-Anchor</span>
                            </span>
                            <span className="font-bold text-gold-400">$10</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100 flex items-center gap-1">
                                <FaSkull className="text-base" />
                                <FaSkull className="text-base" />
                                <FaCompass className="text-base" />
                                <span className="ml-2">Skull-Skull-Compass</span>
                            </span>
                            <span className="font-bold text-gold-400">$5</span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                            <span className="text-cream-100 flex items-center gap-1">
                                <FaSkull className="text-base" />
                                <FaSkull className="text-base" />
                                <FaMap className="text-base" />
                                <span className="ml-2">Skull-Skull-Map</span>
                            </span>
                            <span className="font-bold text-gold-400">$2</span>
                        </li>
                    </ul>
                </div>
            </div>

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
