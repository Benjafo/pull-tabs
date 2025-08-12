import { Router } from "express";
import { StatsController } from "../controllers/stats.controller";

const router = Router();

/**
 * GET /api/gamebox/current
 * Get current game box status (public endpoint)
 */
router.get("/current", StatsController.getCurrentGameBox);

export default router;
