import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export interface UserStatisticsAttributes {
    id: number;
    user_id: number;
    tickets_played: number;
    total_winnings: number;
    biggest_win: number;
    sessions_played: number;
    last_played?: Date | null;
    created_at?: Date;
    updated_at?: Date;
}

interface UserStatisticsCreationAttributes extends Optional<UserStatisticsAttributes, "id"> {}

export class UserStatistics
    extends Model<UserStatisticsAttributes, UserStatisticsCreationAttributes>
    implements UserStatisticsAttributes
{
    public id!: number;
    public user_id!: number;
    public tickets_played!: number;
    public total_winnings!: number;
    public biggest_win!: number;
    public sessions_played!: number;
    public last_played!: Date | null;
    public created_at!: Date;
    public updated_at!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    /**
     * Update statistics after a ticket purchase
     */
    public async updateAfterTicket(payout: number): Promise<void> {
        this.tickets_played += 1;
        this.total_winnings += payout;
        if (payout > this.biggest_win) {
            this.biggest_win = payout;
        }
        this.last_played = new Date();
        await this.save();
    }

    /**
     * Increment session count
     */
    public async incrementSession(): Promise<void> {
        this.sessions_played += 1;
        await this.save();
    }

    /**
     * Calculate win rate percentage
     */
    public getWinRate(): number {
        if (this.tickets_played === 0) return 0;
        // This would need access to winning tickets count
        // For now, return placeholder
        return 0;
    }
}

UserStatistics.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "users",
                key: "id",
            },
        },
        tickets_played: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        total_winnings: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        biggest_win: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        sessions_played: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        last_played: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "UserStatistics",
        tableName: "user_statistics",
        timestamps: true,
        underscored: true,
    }
);

// Define associations
UserStatistics.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(UserStatistics, { foreignKey: "user_id" });

export default UserStatistics;
