import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";

interface TokenPayload {
    userId: number;
    email: string;
}

/**
 * Generate JWT token
 */
export const generateToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    } as SignOptions);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): TokenPayload => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

/**
 * Set JWT token as httpOnly cookie
 */
export const setTokenCookie = (res: Response, token: string): void => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax", // "none" for cross-origin in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/", // Explicitly set path for consistency
    });
};

/**
 * Clear JWT token cookie
 */
export const clearTokenCookie = (res: Response): void => {
    const isProduction = process.env.NODE_ENV === "production";
    
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
};
