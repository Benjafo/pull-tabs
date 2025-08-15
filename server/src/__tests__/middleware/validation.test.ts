import request from "supertest";
import express, { Application, Request, Response } from "express";
import {
    validateRegistration,
    validateLogin,
    handleValidationErrors,
} from "../../middleware/validation";

describe("Validation Middleware", () => {
    let app: Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
    });

    describe("Registration Validation", () => {
        beforeEach(() => {
            app.post(
                "/test-register",
                validateRegistration,
                handleValidationErrors,
                (_req: Request, res: Response) => {
                    res.json({ success: true });
                }
            );
        });

        it("should pass with valid registration data", async () => {
            const response = await request(app).post("/test-register").send({
                email: "valid@example.com",
                password: "ValidPass123",
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should reject missing email", async () => {
            const response = await request(app).post("/test-register").send({
                password: "ValidPass123",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("valid email");
        });

        it("should reject invalid email format", async () => {
            const response = await request(app).post("/test-register").send({
                email: "not-an-email",
                password: "ValidPass123",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("valid email");
        });

        it("should reject short password", async () => {
            const response = await request(app).post("/test-register").send({
                email: "valid@example.com",
                password: "Short1",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("at least 8 characters");
        });

        it("should reject password without uppercase", async () => {
            const response = await request(app).post("/test-register").send({
                email: "valid@example.com",
                password: "lowercase123",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("uppercase letter");
        });

        it("should reject password without lowercase", async () => {
            const response = await request(app).post("/test-register").send({
                email: "valid@example.com",
                password: "UPPERCASE123",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("lowercase letter");
        });

        it("should reject password without number", async () => {
            const response = await request(app).post("/test-register").send({
                email: "valid@example.com",
                password: "NoNumbers",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("one number");
        });

        it("should trim whitespace from email", async () => {
            const response = await request(app).post("/test-register").send({
                email: "  valid@example.com  ",
                password: "ValidPass123",
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should return multiple validation errors", async () => {
            const response = await request(app).post("/test-register").send({
                email: "invalid",
                password: "bad",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors.length).toBeGreaterThan(1);
        });
    });

    describe("Login Validation", () => {
        beforeEach(() => {
            app.post(
                "/test-login",
                validateLogin,
                handleValidationErrors,
                (_req: Request, res: Response) => {
                    res.json({ success: true });
                }
            );
        });

        it("should pass with valid login data", async () => {
            const response = await request(app).post("/test-login").send({
                email: "user@example.com",
                password: "anypassword",
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should reject empty email", async () => {
            const response = await request(app).post("/test-login").send({
                email: "",
                password: "password",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("valid email");
        });

        it("should reject invalid email format", async () => {
            const response = await request(app).post("/test-login").send({
                email: "not-an-email",
                password: "password",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("valid email");
        });

        it("should reject empty password", async () => {
            const response = await request(app).post("/test-login").send({
                email: "user@example.com",
                password: "",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].msg).toContain("Password is required");
        });

        it("should reject missing email field", async () => {
            const response = await request(app).post("/test-login").send({
                password: "password",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it("should reject missing password field", async () => {
            const response = await request(app).post("/test-login").send({
                email: "user@example.com",
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it("should trim whitespace from email", async () => {
            const response = await request(app).post("/test-login").send({
                email: "  user@example.com  ",
                password: "password",
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});
