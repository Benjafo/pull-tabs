import dotenv from "dotenv";
import sequelize from "../config/database";
import "../models"; // Import all models to register them

dotenv.config();

const migrate = async () => {
    try {
        console.log("Starting database migration...");
        
        // Test connection
        await sequelize.authenticate();
        console.log("Database connection established.");
        
        // Sync all models - creates tables if they don't exist
        await sequelize.sync({ alter: true });
        console.log("Database migration completed successfully!");
        
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();