import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
        }

        req.user = user;
        req.userId = user.id;

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

/**
 * Middleware to check if user is authenticated (optional)
 */
export const optionalAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (token) {
            const decoded = verifyToken(token);
            const user = await User.findByPk(decoded.userId);

            if (user) {
                req.user = user;
                req.userId = user.id;
            }
        }
    } catch {
        // Token is invalid, but that's okay for optional auth
    }

    next();
};
