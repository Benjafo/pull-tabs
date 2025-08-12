import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * All ticket routes require authentication
 */
router.use(authenticate);

/**
 * POST /api/tickets/purchase
 * Purchase a new ticket
 */
router.post("/purchase", TicketController.purchaseTicket);

/**
 * GET /api/tickets
 * Get user's ticket history
 */
router.get("/", TicketController.getUserTickets);

/**
 * GET /api/tickets/:id
 * Get specific ticket details
 */
router.get("/:id", TicketController.getTicket);

/**
 * POST /api/tickets/:id/reveal
 * Reveal a tab on a ticket
 */
router.post("/:id/reveal", TicketController.revealTab);

export default router;
