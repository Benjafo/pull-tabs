import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Increase timeout for database operations
jest.setTimeout(10000);

// Mock console.error for database connection errors in tests
const originalError = console.error;
beforeAll(() => {
    console.error = jest.fn((message) => {
        // Suppress database connection errors in test output
        if (
            typeof message === "string" &&
            (message.includes("Unable to connect to the database") ||
                message.includes("SequelizeConnectionRefusedError"))
        ) {
            return;
        }
        originalError(message);
    });
});

afterAll(() => {
    console.error = originalError;
});

// Add a dummy test to prevent Jest from complaining
describe("Test Setup", () => {
    it("should load environment variables", () => {
        expect(process.env.NODE_ENV).toBe("test");
    });
});