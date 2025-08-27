import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes";
import gameboxRoutes from "./routes/gamebox.routes";
import statsRoutes from "./routes/stats.routes";
import ticketRoutes from "./routes/ticket.routes";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Create Express app
const app: Application = express();

// Trust proxy - REQUIRED for Railway deployment
// This allows Express to properly handle X-Forwarded headers
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Health check endpoint (before any middleware that might block it)
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Rate limiting
let maxRequests;
if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
    maxRequests = 10000;
} else {
    maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS);
}
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
    max: maxRequests,
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/gamebox", gameboxRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
