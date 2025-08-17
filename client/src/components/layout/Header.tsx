import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAnchor } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="sticky top-2 mb-1 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-navy-600/95 to-navy-700/95 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-gold-600/40 relative overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_3s_infinite]" />
                    
                    <div className="relative flex justify-between items-center h-16 px-4">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 hover:opacity-90 transition-opacity group"
                        >
                            <FaAnchor className="text-3xl text-gold-400 group-hover:rotate-12 transition-transform" />
                            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                                Pirate's Treasure
                            </h1>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center">
                            {user ? (
                                <div className="flex items-center">
                                    <Link
                                        to="/game"
                                        className="bg-navy-500/50 hover:bg-gold-600/20 border border-gold-600/30 px-4 py-2 rounded-lg transition-all ml-2 font-bold text-cream-100 hover:text-gold-400"
                                    >
                                        Play Game
                                    </Link>
                                    <Link
                                        to="/stats"
                                        className="bg-navy-500/50 hover:bg-gold-600/20 border border-gold-600/30 px-4 py-2 rounded-lg transition-all ml-2 font-bold text-cream-100 hover:text-gold-400"
                                    >
                                        My Stats
                                    </Link>
                                    <div className="flex items-center ml-8 pl-8 border-l border-gold-600/30">
                                        <span className="text-sm text-gold-400 font-bold">Ahoy, {user.email}!</span>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all ml-4 text-cream-100 border border-red-800/50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="bg-navy-500/50 hover:bg-gold-600/20 border border-gold-600/30 px-4 py-2 rounded-lg transition-all ml-2 font-bold text-cream-100 hover:text-gold-400"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 px-4 py-2 rounded-lg text-navy-900 font-bold transition-all ml-2 border border-gold-700/50"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gold-600/20 border border-gold-600/30 transition-all"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden py-4 border-t border-gold-600/30 relative">
                            {user ? (
                                <div className="space-y-2">
                                    <Link
                                        to="/game"
                                        className="block hover:bg-gold-600/20 px-4 py-2 rounded-lg transition-all font-bold text-cream-100 hover:text-gold-400 border border-transparent hover:border-gold-600/30"
                                    >
                                        Play Game
                                    </Link>
                                    <Link
                                        to="/stats"
                                        className="block hover:bg-gold-600/20 px-4 py-2 rounded-lg transition-all font-bold text-cream-100 hover:text-gold-400 border border-transparent hover:border-gold-600/30"
                                    >
                                        My Stats
                                    </Link>
                                    <div className="pt-4 mt-4 border-t border-gold-600/30">
                                        <p className="px-4 py-2 text-sm text-gold-400 font-bold">Ahoy, {user.email}!</p>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all text-cream-100 border border-red-800/50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        className="block hover:bg-gold-600/20 px-4 py-2 rounded-lg transition-all font-bold text-cream-100 hover:text-gold-400 border border-transparent hover:border-gold-600/30"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 px-4 py-2 rounded-lg text-navy-900 font-bold transition-all border border-gold-700/50"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}