import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

/**
 * Validation rules for user registration
 */
export const validateRegistration = [
    body("username")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters")
        .isAlphanumeric()
        .withMessage("Username must contain only letters and numbers"),
    body("email").trim().isEmail().withMessage("Please provide a valid email address"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
];
