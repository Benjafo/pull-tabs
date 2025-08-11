import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    statusCode?: number;
    errors?: unknown[];
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    console.error("Error:", {
        message: err.message,
        stack: err.stack,
        statusCode,
    });

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
            errors: err.errors,
        }),
    });
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
    res.status(404).json({ error: "Resource not found" });
};
