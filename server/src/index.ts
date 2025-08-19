import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = process.env.PORT || 3001;

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
    try {
        // Connect to database
        await connectDatabase();

        // Start server - bind to 0.0.0.0 for Railway
        app.listen(PORT as number, "0.0.0.0", () => {
            console.log(`Server is running on 0.0.0.0:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});

// Start the server
startServer();
