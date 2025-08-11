import { Router } from "express";
import { register, login, logout, verify } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import {
    validateRegistration,
    validateLogin,
    handleValidationErrors,
} from "../middleware/validation";

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", validateRegistration, handleValidationErrors, register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post("/login", validateLogin, handleValidationErrors, login);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post("/logout", logout);

/**
 * GET /api/auth/verify
 * Verify JWT token and get current user
 */
router.get("/verify", authenticate, verify);

export default router;
