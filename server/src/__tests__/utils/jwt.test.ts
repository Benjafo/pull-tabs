import { Response } from "express";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken, setTokenCookie, clearTokenCookie } from "../../utils/jwt";

describe("JWT Utilities", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        process.env.JWT_SECRET = "test_secret_key";
        process.env.JWT_EXPIRES_IN = "24h";
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe("generateToken", () => {
        it("should generate a valid JWT token", () => {
            const payload = { userId: 1, username: "testuser" };
            const token = generateToken(payload);

            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
            expect(token.split(".").length).toBe(3); // JWT format: header.payload.signature
        });

        it("should include payload data in token", () => {
            const payload = { userId: 123, username: "testuser" };
            const token = generateToken(payload);

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            expect(decoded.userId).toBe(123);
            expect(decoded.username).toBe("testuser");
        });

        it("should throw error if JWT_SECRET is not configured", () => {
            process.env.JWT_SECRET = undefined as any;

            expect(() => {
                generateToken({ userId: 1, username: "test" });
            }).toThrow("JWT_SECRET is not configured");
        });

        it("should set expiration time", () => {
            const payload = { userId: 1, username: "testuser" };
            const token = generateToken(payload);

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            expect(decoded.exp).toBeDefined();
            expect(decoded.iat).toBeDefined();
            expect(decoded.exp - decoded.iat).toBe(24 * 60 * 60); // 24 hours in seconds
        });
    });

    describe("verifyToken", () => {
        it("should verify and decode valid token", () => {
            const payload = { userId: 456, username: "testuser" };
            const token = generateToken(payload);

            const decoded = verifyToken(token);
            expect(decoded.userId).toBe(456);
            expect(decoded.username).toBe("testuser");
        });

        it("should throw error for invalid token", () => {
            expect(() => {
                verifyToken("invalid.token.here");
            }).toThrow("Invalid or expired token");
        });

        it("should throw error for expired token", () => {
            const payload = { userId: 1, username: "testuser" };
            const expiredToken = jwt.sign(payload, process.env.JWT_SECRET!, {
                expiresIn: "-1h", // Already expired
            });

            expect(() => {
                verifyToken(expiredToken);
            }).toThrow("Invalid or expired token");
        });

        it("should throw error if JWT_SECRET is not configured", () => {
            const token = generateToken({ userId: 1, username: "test" });
            process.env.JWT_SECRET = undefined as any;

            expect(() => {
                verifyToken(token);
            }).toThrow("JWT_SECRET is not configured");
        });

        it("should throw error for token signed with different secret", () => {
            const payload = { userId: 1, username: "testuser" };
            const tokenWithDifferentSecret = jwt.sign(payload, "different_secret");

            expect(() => {
                verifyToken(tokenWithDifferentSecret);
            }).toThrow("Invalid or expired token");
        });
    });

    describe("setTokenCookie", () => {
        it("should set cookie with correct options in development", () => {
            process.env.NODE_ENV = "development";
            const mockResponse = {
                cookie: jest.fn(),
            } as unknown as Response;

            const token = "test_token";
            setTokenCookie(mockResponse, token);

            expect(mockResponse.cookie).toHaveBeenCalledWith("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
            });
        });

        it("should set secure cookie in production", () => {
            process.env.NODE_ENV = "production";
            const mockResponse = {
                cookie: jest.fn(),
            } as unknown as Response;

            const token = "test_token";
            setTokenCookie(mockResponse, token);

            expect(mockResponse.cookie).toHaveBeenCalledWith("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });
        });
    });

    describe("clearTokenCookie", () => {
        it("should clear the token cookie", () => {
            const mockResponse = {
                clearCookie: jest.fn(),
            } as unknown as Response;

            clearTokenCookie(mockResponse);

            expect(mockResponse.clearCookie).toHaveBeenCalledWith("token");
        });
    });
});