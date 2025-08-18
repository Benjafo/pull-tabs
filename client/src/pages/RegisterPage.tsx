import type { FormEvent } from "react";
import { useState } from "react";
import { GiOpenTreasureChest } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { OceanBackground } from "../components/layout/OceanBackground";
import { useAuth } from "../hooks/useAuth";

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) clearError();
        if (validationError) setValidationError(null);
    };

    const validateForm = (): boolean => {
        if (formData.password !== formData.confirmPassword) {
            setValidationError("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            setValidationError("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await register({
                email: formData.email,
                password: formData.password,
            });
            navigate("/game");
        } catch {
            // Error is handled in context
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayError = validationError || error;

    return (
        <div className="py-8 relative">
            <OceanBackground variant="waves" intensity="subtle" />

            <div className="max-w-md mx-auto relative z-10">
                {/* Header */}
                <div className="text-center text-cream-100 mb-8">
                    <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 drop-shadow-lg">
                        Join the Adventure!
                    </h1>
                    <p className="text-xl text-cream-100/80">
                        Embark on your treasure hunting journey
                    </p>
                </div>

                {/* Register Form */}
                <div className="relative bg-gradient-to-br from-navy-600/95 to-navy-700/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 border-2 border-gold-600/40">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold-400/50 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-400/50 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-400/50 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold-400/50 rounded-br-lg" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div className="text-center mb-6">
                            <GiOpenTreasureChest className="text-6xl text-gold-400 mx-auto animate-float" />
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 mt-4">
                                Create Your Account
                            </h2>
                        </div>

                        {displayError && (
                            <div
                                className="bg-red-900/20 border border-red-600/30 text-red-400 px-4 py-3 rounded-lg"
                                role="alert"
                            >
                                {displayError}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-bold text-gold-400 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-navy-700/50 border border-gold-600/30 rounded-lg text-cream-100 placeholder-cream-100/50 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-bold text-gold-400 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                placeholder="Create a password (min 6 characters)"
                                minLength={6}
                                className="w-full px-4 py-3 bg-navy-700/50 border border-gold-600/30 rounded-lg text-cream-100 placeholder-cream-100/50 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-bold text-gold-400 mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 bg-navy-700/50 border border-gold-600/30 rounded-lg text-cream-100 placeholder-cream-100/50 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-navy-900 py-3 px-6 rounded-lg text-lg font-black transform transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </button>

                        <div className="text-center text-cream-100/70">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-gold-400 hover:text-gold-300 font-bold"
                            >
                                Set Sail
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
