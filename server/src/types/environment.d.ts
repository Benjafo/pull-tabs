declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test";
            PORT: string;
            DB_HOST: string;
            DB_PORT: string;
            DB_NAME: string;
            DB_USER: string;
            DB_PASSWORD: string;
            JWT_SECRET: string;
            JWT_EXPIRES_IN: string;
            CLIENT_URL: string;
            RATE_LIMIT_WINDOW_MS: string;
            RATE_LIMIT_MAX_REQUESTS: string;
        }
    }
}

export {};
