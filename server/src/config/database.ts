import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const getDatabaseConfig = () => {
    // Railway provides DATABASE_URL in production
    if (process.env.DATABASE_URL) {
        return {
            url: process.env.DATABASE_URL,
            dialect: "postgres" as const,
            logging: process.env.NODE_ENV === "development" ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            dialectOptions: {
                ssl:
                    process.env.NODE_ENV === "production"
                        ? {
                              require: true,
                              rejectUnauthorized: false,
                          }
                        : false,
            },
        };
    }

    // Local development configuration
    return {
        dialect: "postgres" as const,
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "pulltabs",
        username: process.env.DB_USER || "pulltabs_user",
        password: process.env.DB_PASSWORD || "",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    };
};

const sequelize = new Sequelize(getDatabaseConfig());

export const connectDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        if (process.env.NODE_ENV !== "production") {
            await sequelize.sync({ alter: true });
            console.log("Database models synchronized.");
        }
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

export default sequelize;
