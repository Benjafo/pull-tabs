import sequelize from "../../config/database";
import { User } from "../../models";
import bcrypt from "bcryptjs";

describe("User Model", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await User.destroy({ where: {} });
    });

    describe("User Creation", () => {
        it("should create a user with valid data", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            expect(user.id).toBeDefined();
            expect(user.username).toBe("testuser");
            expect(user.email).toBe("test@example.com");
            expect(user.created_at).toBeDefined();
        });

        it("should hash password on creation", async () => {
            const plainPassword = "password123";
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: plainPassword,
            });

            expect(user.password_hash).not.toBe(plainPassword);
            expect(user.password_hash.length).toBeGreaterThan(plainPassword.length);

            // Verify it's a valid bcrypt hash
            const isValid = await bcrypt.compare(plainPassword, user.password_hash);
            expect(isValid).toBe(true);
        });

        it("should enforce unique username constraint", async () => {
            await User.create({
                username: "testuser",
                email: "test1@example.com",
                password_hash: "password123",
            });

            await expect(
                User.create({
                    username: "testuser",
                    email: "test2@example.com",
                    password_hash: "password456",
                })
            ).rejects.toThrow();
        });

        it("should enforce unique email constraint", async () => {
            await User.create({
                username: "testuser1",
                email: "test@example.com",
                password_hash: "password123",
            });

            await expect(
                User.create({
                    username: "testuser2",
                    email: "test@example.com",
                    password_hash: "password456",
                })
            ).rejects.toThrow();
        });

        it("should validate username length", async () => {
            await expect(
                User.create({
                    username: "ab",
                    email: "test@example.com",
                    password_hash: "password123",
                })
            ).rejects.toThrow();

            await expect(
                User.create({
                    username: "a".repeat(51),
                    email: "test@example.com",
                    password_hash: "password123",
                })
            ).rejects.toThrow();
        });

        it("should validate email format", async () => {
            await expect(
                User.create({
                    username: "testuser",
                    email: "invalid-email",
                    password_hash: "password123",
                })
            ).rejects.toThrow();
        });
    });

    describe("Password Methods", () => {
        it("should hash password using static method", async () => {
            const plainPassword = "TestPassword123";
            const hashedPassword = await User.hashPassword(plainPassword);

            expect(hashedPassword).not.toBe(plainPassword);
            expect(hashedPassword.length).toBeGreaterThan(plainPassword.length);

            const isValid = await bcrypt.compare(plainPassword, hashedPassword);
            expect(isValid).toBe(true);
        });

        it("should validate correct password", async () => {
            const plainPassword = "password123";
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: plainPassword,
            });

            const isValid = await user.validatePassword(plainPassword);
            expect(isValid).toBe(true);
        });

        it("should reject incorrect password", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            const isValid = await user.validatePassword("wrongpassword");
            expect(isValid).toBe(false);
        });
    });

    describe("User Methods", () => {
        it("should update last login timestamp", async () => {
            const user = await User.create({
                username: "testuser",
                email: "test@example.com",
                password_hash: "password123",
            });

            expect(user.last_login).toBeNull();

            await user.updateLastLogin();

            const updatedUser = await User.findByPk(user.id);
            expect(updatedUser?.last_login).toBeDefined();
            expect(updatedUser?.last_login).toBeInstanceOf(Date);
        });
    });
});