import { Link } from "react-router-dom";
import { OceanBackground } from "../components/ui/OceanBackground";
import { useAuth } from "../hooks/useAuth";

export function HomePage() {
    const { user } = useAuth();

    return (
        <div className="py-8 relative">
            <OceanBackground showAnimatedElements={true} intensity="subtle" />
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
                            <span className="text-cream-100">💀💀💀 Three Skulls</span>
                            <span className="font-bold text-gold-400">$100</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100">💀💀💎 Skull-Skull-Treasure</span>
                            <span className="font-bold text-gold-400">$50</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100">💀💀⛵ Skull-Skull-Ship</span>
                            <span className="font-bold text-gold-400">$20</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100">💀💀⚓ Skull-Skull-Anchor</span>
                            <span className="font-bold text-gold-400">$10</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-navy-500">
                            <span className="text-cream-100">💀💀🧭 Skull-Skull-Compass</span>
                            <span className="font-bold text-gold-400">$5</span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                            <span className="text-cream-100">💀💀🗺️ Skull-Skull-Map</span>
                            <span className="font-bold text-gold-400">$2</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center relative z-10">
                {user ? (
                    <Link
                        to="/game"
                        className="inline-block bg-gold-600 hover:bg-gold-700 text-cream-100 px-8 py-4 rounded-lg text-xl font-bold transform transition-all hover:scale-105 hover:shadow-xl"
                    >
                        Play Now
                    </Link>
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
