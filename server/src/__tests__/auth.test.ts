import request from "supertest";
import app from "../app";
import sequelize from "../config/database";
import { User, UserStatistics, Ticket } from "../models";

describe("Authentication Endpoints", () => {
    beforeAll(async () => {
        try {
            await sequelize.sync({ force: true });
        } catch (error) {
            // If force sync fails, try to manually clean up
            await sequelize.query(
                "TRUNCATE TABLE tickets, user_statistics, game_boxes, users CASCADE"
            );
        }
    });

    beforeEach(async () => {
        // Clean up in correct order to respect foreign keys
        await Ticket.destroy({ where: {} });
        await UserStatistics.destroy({ where: {} });
        await User.destroy({ where: {} });
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const userData = {
                email: "test@example.com",
                password: "TestPass123",
            };

            const response = await request(app).post("/api/auth/register").send(userData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Registration successful");
            expect(response.body.user).toHaveProperty("id");
            expect(response.body.user.email).toBe("test@example.com");
            expect(response.headers["set-cookie"]).toBeDefined();

            // Verify user was created in database
            const user = await User.findOne({ where: { email: "test@example.com" } });
            expect(user).toBeTruthy();
            expect(user?.email).toBe("test@example.com");

            // Verify user statistics were created
            const stats = await UserStatistics.findOne({ where: { user_id: user?.id } });
            expect(stats).toBeTruthy();
            expect(stats?.sessions_played).toBe(1);
        });

        it("should reject registration with duplicate email", async () => {
            const userData = {
                email: "test@example.com",
                password: "TestPass123",
            };

            await request(app).post("/api/auth/register").send(userData);

            const response = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "TestPass456",
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Email already registered");
        });

        it("should reject registration with different email but same one", async () => {
            const userData = {
                email: "test@example.com",
                password: "TestPass123",
            };

            await request(app).post("/api/auth/register").send(userData);

            const response = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "TestPass456",
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Email already registered");
        });

        it("should validate email is provided", async () => {
            const response = await request(app).post("/api/auth/register").send({
                password: "TestPass123",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it("should validate email format", async () => {
            const response = await request(app).post("/api/auth/register").send({
                email: "invalid-email",
                password: "TestPass123",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("valid email");
        });

        it("should validate password complexity", async () => {
            const response = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "weak",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("at least 8 characters");
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            // Create a test user
            await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "TestPass123",
            });
        });

        it("should login with valid credentials", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "TestPass123",
            });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Login successful");
            expect(response.body.user.email).toBe("test@example.com");
            expect(response.headers["set-cookie"]).toBeDefined();
        });

        it("should reject login with missing email", async () => {
            const response = await request(app).post("/api/auth/login").send({
                password: "TestPass123",
            });

            expect(response.status).toBe(400);
        });

        it("should reject login with invalid email", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "wrong@example.com",
                password: "TestPass123",
            });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Invalid credentials");
        });

        it("should reject login with invalid password", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "WrongPassword",
            });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Invalid credentials");
        });

        it("should increment session count on login", async () => {
            const user = await User.findOne({ where: { email: "test@example.com" } });
            const initialStats = await UserStatistics.findOne({ where: { user_id: user?.id } });
            const initialSessions = initialStats?.sessions_played || 0;

            await request(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "TestPass123",
            });

            const updatedStats = await UserStatistics.findOne({ where: { user_id: user?.id } });
            expect(updatedStats?.sessions_played).toBe(initialSessions + 1);
        });
    });

    describe("POST /api/auth/logout", () => {
        it("should clear authentication cookie", async () => {
            const response = await request(app).post("/api/auth/logout");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Logout successful");
            expect(response.headers["set-cookie"]).toBeDefined();
            expect(response.headers["set-cookie"][0]).toContain("token=;");
        });
    });

    describe("GET /api/auth/verify", () => {
        let authCookie: string;

        beforeEach(async () => {
            // Register and login to get auth cookie
            await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "TestPass123",
            });

            const loginResponse = await request(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "TestPass123",
            });

            authCookie = loginResponse.headers["set-cookie"][0];
        });

        it("should verify valid authentication token", async () => {
            const response = await request(app).get("/api/auth/verify").set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe("test@example.com");
        });

        it("should reject request without authentication", async () => {
            const response = await request(app).get("/api/auth/verify");

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Authentication required");
        });

        it("should reject request with invalid token", async () => {
            const response = await request(app)
                .get("/api/auth/verify")
                .set("Cookie", "token=invalid_token");

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Invalid or expired token");
        });
    });
});
