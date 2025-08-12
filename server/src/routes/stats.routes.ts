import { Router } from "express";
import { StatsController } from "../controllers/stats.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * GET /api/stats
 * Get user statistics (requires authentication)
 */
router.get("/", authenticate, StatsController.getUserStats);

/**
 * GET /api/stats/session
 * Get current session statistics (requires authentication)
 */
router.get("/session", authenticate, StatsController.getSessionStats);

/**
 * GET /api/stats/leaderboard
 * Get top players (public endpoint)
 */
router.get("/leaderboard", StatsController.getLeaderboard);

export default router;
