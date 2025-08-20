import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
          dialect: "postgres",
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
      })
    : new Sequelize({
          dialect: "postgres",
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
      });

export const connectDatabase = async (): Promise<void> => {
    try {
        console.log("Attempting database connection...");
        console.log("NODE_ENV:", process.env.NODE_ENV);
        console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
        
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        if (process.env.NODE_ENV !== "production") {
            await sequelize.sync({ alter: true });
            console.log("Database models synchronized.");
        }
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        console.error("Connection details:", {
            hasDbUrl: !!process.env.DATABASE_URL,
            nodeEnv: process.env.NODE_ENV,
        });
        process.exit(1);
    }
};

export default sequelize;
