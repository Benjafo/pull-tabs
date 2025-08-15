import bcrypt from "bcryptjs";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
    id: number;
    username?: string; // Optional for backwards compatibility
    email: string;
    password_hash: string;
    created_at?: Date;
    last_login?: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare username?: string; // Optional for backwards compatibility
    declare email: string;
    declare password_hash: string;
    declare created_at: Date;
    declare last_login: Date | null;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    /**
     * Hash password before saving
     */
    public static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    /**
     * Validate password against hash
     */
    public async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password_hash);
    }

    /**
     * Update last login timestamp
     */
    public async updateLastLogin(): Promise<void> {
        this.last_login = new Date();
        await this.save();
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: true, // Made optional
            unique: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
        underscored: true,
        hooks: {
            beforeCreate: async (user: User) => {
                if (user.password_hash) {
                    user.password_hash = await User.hashPassword(user.password_hash);
                }
            },
        },
    }
);

export default User;
