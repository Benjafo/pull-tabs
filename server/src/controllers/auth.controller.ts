import { Request, Response } from "express";
import User from "../models/User";
import UserStatistics from "../models/UserStatistics";
import { generateToken, setTokenCookie, clearTokenCookie } from "../utils/jwt";
import { Op } from "sequelize";

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({
                error: "Email already registered",
            });
            return;
        }

        // Create new user
        const user = await User.create({
            username: email.split('@')[0], // Use email prefix as username
            email,
            password_hash: password, // Will be hashed by beforeCreate hook
        });

        // Create user statistics entry
        await UserStatistics.create({
            user_id: user.id,
            tickets_played: 0,
            total_winnings: 0,
            biggest_win: 0,
            sessions_played: 1,
        });

        // Generate token and set cookie
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });
        setTokenCookie(res, token);

        // Update last login
        await user.updateLastLogin();

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user.id,
                username: user.username || user.email,  // Use email as fallback
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        // Validate password
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        // Generate token and set cookie
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });
        setTokenCookie(res, token);

        // Update last login and session count
        await user.updateLastLogin();

        const stats = await UserStatistics.findOne({ where: { user_id: user.id } });
        if (stats) {
            await stats.incrementSession();
        }

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username || user.email,  // Use email as fallback
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
};

/**
 * Logout user
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
    clearTokenCookie(res);
    res.json({ message: "Logout successful" });
};

/**
 * Verify token and get current user
 */
export const verify = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    res.json({
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
        },
    });
};
