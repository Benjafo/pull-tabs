import { useState } from "react";
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
        <header className="bg-primary-100 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        to="/"
                        className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                        <h1 className="text-xl font-bold">Pull Tabs Treasure</h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center">
                                <Link
                                    to="/blank"
                                    className="hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Blank
                                </Link>
                                <Link
                                    to="/game"
                                    className="hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors ml-2"
                                >
                                    Play Game
                                </Link>
                                <Link
                                    to="/stats"
                                    className="hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors ml-2"
                                >
                                    My Stats
                                </Link>
                                <div className="flex items-center ml-8 pl-8 border-l border-primary-600">
                                    <span className="text-sm">Ahoy, {user.email}!</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/blank"
                                    className="hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Blank
                                </Link>
                                <Link
                                    to="/login"
                                    className="hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors ml-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-primary-700"
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
                    <nav className="md:hidden py-4 border-t border-primary-700">
                        {user ? (
                            <div className="space-y-2">
                                <Link
                                    to="/blank"
                                    className="block hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Blank
                                </Link>
                                <Link
                                    to="/game"
                                    className="block hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Play Game
                                </Link>
                                <Link
                                    to="/stats"
                                    className="block hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    My Stats
                                </Link>
                                <div className="pt-4 mt-4 border-t border-primary-700">
                                    <p className="px-4 py-2 text-sm">Ahoy, {user.email}!</p>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    to="/login"
                                    className="block hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
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
