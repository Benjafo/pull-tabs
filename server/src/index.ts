import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = parseInt(process.env.PORT || "3001", 10);
const HOST = "0.0.0.0";

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
    try {
        // Connect to database
        await connectDatabase();

        // Start server - bind to 0.0.0.0 for Railway
        const server = app.listen(PORT, HOST, () => {
            console.log(`Server is running on ${HOST}:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
            console.log(`Railway PORT: ${process.env.PORT}`);
            console.log(`Health check available at /health`);
        });

        // Ensure server is listening
        server.on("listening", () => {
            console.log("Server is now listening for connections");
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
