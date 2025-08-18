import { useState } from "react";
import { FaAnchor } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
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
        <header className="backdrop-blur-md text-white sticky top-2 py-2 mb-1 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 hover:opacity-90 transition-opacity group"
                    >
                        <FaAnchor className="text-3xl text-gold-400 group-hover:rotate-12 transition-transform" />
                        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                            Pull Tabs Treasure
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center">
                                <Link
                                    to="/game"
                                    className="hover:bg-navy-600 px-4 py-2 rounded-lg transition-colors ml-2 font-bold text-cream-100 hover:text-gold-400"
                                >
                                    Play Game
                                </Link>
                                <Link
                                    to="/stats"
                                    className="hover:bg-navy-600 px-4 py-2 rounded-lg transition-colors ml-2 font-bold text-cream-100 hover:text-gold-400"
                                >
                                    My Stats
                                </Link>
                                <div className="flex items-center ml-8 pl-8 border-l border-gold-600/30">
                                    <span className="text-sm text-gold-400 font-bold">
                                        Ahoy, {user.email}!
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="hover:bg-navy-600 px-4 py-2 rounded-lg text-sm font-bold text-cream-100 hover:text-red-400 transition-colors ml-4"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hover:bg-navy-600 px-4 py-2 font-bold text-cream-100  rounded-lg transition-colors ml-2 mr-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gold-600 hover:bg-gold-700 px-4 py-2  font-bold rounded-lg text-cream-100 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-navy-600"
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
                    <nav className="md:hidden py-4 border-t border-navy-600">
                        {user ? (
                            <div className="space-y-2">
                                <Link
                                    to="/game"
                                    className="block hover:bg-navy-600 px-4 py-2 rounded-lg transition-colors font-bold text-cream-100 hover:text-gold-400"
                                >
                                    Play Game
                                </Link>
                                <Link
                                    to="/stats"
                                    className="block hover:bg-navy-600 px-4 py-2 rounded-lg transition-colors font-bold text-cream-100 hover:text-gold-400"
                                >
                                    My Stats
                                </Link>
                                <div className="pt-4 mt-4 border-t border-navy-600">
                                    <p className="px-4 py-2 text-sm text-gold-400 font-bold">
                                        Ahoy, {user.email}!
                                    </p>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left hover:bg-navy-600 px-4 py-2 rounded-lg text-sm font-bold text-cream-100 hover:text-red-400 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    to="/login"
                                    className="block hover:bg-navy-600 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block bg-gold-600 hover:bg-gold-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}
