import bcrypt from "bcryptjs";
import sequelize from "../../config/database";
import { User } from "../../models";

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
                email: "test@example.com",
                password_hash: "password123",
            });

            expect(user.id).toBeDefined();
            expect(user.email).toBe("test@example.com");
            expect(user.created_at).toBeDefined();
        });

        it("should hash password on creation", async () => {
            const plainPassword = "password123";
            const user = await User.create({
                email: "test@example.com",
                password_hash: plainPassword,
            });

            expect(user.password_hash).not.toBe(plainPassword);
            expect(user.password_hash.length).toBeGreaterThan(plainPassword.length);

            // Verify it's a valid bcrypt hash
            const isValid = await bcrypt.compare(plainPassword, user.password_hash);
            expect(isValid).toBe(true);
        });

        it("should allow users with different emails", async () => {
            const user1 = await User.create({
                email: "test1@example.com",
                password_hash: "password123",
            });

            const user2 = await User.create({
                email: "test2@example.com",
                password_hash: "password456",
            });

            expect(user1.id).not.toBe(user2.id);
        });

        it("should enforce unique email constraint", async () => {
            await User.create({
                email: "test@example.com",
                password_hash: "password123",
            });

            await expect(
                User.create({
                    email: "test@example.com",
                    password_hash: "password456",
                })
            ).rejects.toThrow();
        });

        it("should require an email", async () => {
            await expect(
                User.create({
                    password_hash: "password123",
                } as any)
            ).rejects.toThrow();
        });

        it("should validate email format", async () => {
            await expect(
                User.create({
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
                email: "test@example.com",
                password_hash: plainPassword,
            });

            const isValid = await user.validatePassword(plainPassword);
            expect(isValid).toBe(true);
        });

        it("should reject incorrect password", async () => {
            const user = await User.create({
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
