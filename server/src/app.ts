import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import statsRoutes from "./routes/stats.routes";
import gameboxRoutes from "./routes/gamebox.routes";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Rate limiting (relaxed in test environment)
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
    max: process.env.NODE_ENV === "test" ? 10000 : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/gamebox", gameboxRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
