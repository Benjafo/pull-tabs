import { DataTypes, Model, Optional, Transaction } from "sequelize";
import sequelize from "../config/database";

interface WinnersRemaining {
    100: number;
    20: number;
    10: number;
    5: number;
    2: number;
    1: number;
}

export interface GameBoxAttributes {
    id: number;
    total_tickets: number;
    remaining_tickets: number;
    winners_remaining: WinnersRemaining;
    created_at?: Date;
    completed_at?: Date | null;
}

interface GameBoxCreationAttributes extends Optional<GameBoxAttributes, "id"> {}

export class GameBox
    extends Model<GameBoxAttributes, GameBoxCreationAttributes>
    implements GameBoxAttributes
{
    declare id: number;
    declare total_tickets: number;
    declare remaining_tickets: number;
    declare winners_remaining: WinnersRemaining;
    declare created_at: Date;
    declare completed_at: Date | null;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    /**
     * Initialize a new game box with standard distribution
     */
    public static createNewBox(): GameBoxCreationAttributes {
        return {
            total_tickets: 500,
            remaining_tickets: 500,
            winners_remaining: {
                100: 1,
                20: 2,
                10: 5,
                5: 5,
                2: 48,
                1: 64,
            },
        };
    }

    /**
     * Check if box has any tickets remaining
     */
    public hasTicketsRemaining(): boolean {
        return this.remaining_tickets > 0;
    }

    /**
     * Check if box has any winners remaining
     */
    public hasWinnersRemaining(): boolean {
        const winners = this.winners_remaining;
        return Object.values(winners).some((count) => count > 0);
    }

    /**
     * Decrement ticket count and mark complete if needed
     */
    public async useTicket(transaction?: Transaction): Promise<void> {
        this.remaining_tickets -= 1;
        if (this.remaining_tickets === 0) {
            this.completed_at = new Date();
        }
        await this.save({ transaction });
    }

    /**
     * Decrement winner count for specific prize
     */
    public async useWinner(
        prize: keyof WinnersRemaining,
        transaction?: Transaction
    ): Promise<void> {
        const winners = { ...this.winners_remaining };
        if (winners[prize] > 0) {
            winners[prize] -= 1;
            this.winners_remaining = winners;
            this.changed("winners_remaining", true);
            await this.save({ transaction });
        }
    }
}

GameBox.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        total_tickets: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 500,
        },
        remaining_tickets: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 500,
        },
        winners_remaining: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {
                100: 1,
                20: 2,
                10: 5,
                5: 5,
                2: 48,
                1: 64,
            },
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "GameBox",
        tableName: "game_boxes",
        timestamps: true,
        underscored: true,
    }
);

export default GameBox;
