import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import GameBox from "./GameBox";

export enum GameSymbol {
    SKULL = 0,
    TREASURE = 1,
    SHIP = 2,
    ANCHOR = 3,
    COMPASS = 4,
    MAP = 5,
}

export interface WinningLine {
    line: number;
    symbols: GameSymbol[];
    prize: number;
}

export interface TicketAttributes {
    id: number;
    user_id: number;
    game_box_id: number;
    symbols: GameSymbol[];
    winning_lines: WinningLine[];
    total_payout: number;
    is_winner: boolean;
    revealed_tabs?: number[];
    created_at?: Date;
}

interface TicketCreationAttributes extends Optional<TicketAttributes, "id"> {}

export class Ticket
    extends Model<TicketAttributes, TicketCreationAttributes>
    implements TicketAttributes
{
    declare id: number;
    declare user_id: number;
    declare game_box_id: number;
    declare symbols: GameSymbol[];
    declare winning_lines: WinningLine[];
    declare total_payout: number;
    declare is_winner: boolean;
    declare revealed_tabs: number[];
    declare created_at: Date;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    /**
     * Check for winning lines in the ticket
     */
    public static checkWinningLines(symbols: GameSymbol[]): WinningLine[] {
        const winningLines: WinningLine[] = [];
        const lines = [
            [0, 1, 2], // Tab 1
            [3, 4, 5], // Tab 2
            [6, 7, 8], // Tab 3
            [9, 10, 11], // Tab 4
            [12, 13, 14], // Tab 5
        ];

        lines.forEach((line, lineIndex) => {
            const lineSymbols = [symbols[line[0]], symbols[line[1]], symbols[line[2]]];

            // Check for Skull-Skull-X pattern
            if (lineSymbols[0] === GameSymbol.SKULL && lineSymbols[1] === GameSymbol.SKULL) {
                let prize = 0;
                switch (lineSymbols[2]) {
                    case GameSymbol.SKULL:
                        prize = 100;
                        break;
                    case GameSymbol.TREASURE:
                        prize = 20;
                        break;
                    case GameSymbol.SHIP:
                        prize = 10;
                        break;
                    case GameSymbol.ANCHOR:
                        prize = 5;
                        break;
                    case GameSymbol.COMPASS:
                        prize = 2;
                        break;
                    case GameSymbol.MAP:
                        prize = 1;
                        break;
                }

                if (prize > 0) {
                    winningLines.push({
                        line: lineIndex + 1,
                        symbols: lineSymbols,
                        prize,
                    });
                }
            }
        });

        return winningLines;
    }

    /**
     * Calculate total payout from winning lines
     */
    public static calculatePayout(winningLines: WinningLine[]): number {
        return winningLines.reduce((total, line) => total + line.prize, 0);
    }
}

Ticket.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        game_box_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "game_boxes",
                key: "id",
            },
        },
        symbols: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
            validate: {
                isArrayLength(value: number[]) {
                    if (value.length !== 15) {
                        throw new Error("Symbols array must contain exactly 15 elements");
                    }
                },
            },
        },
        winning_lines: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        total_payout: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            get() {
                const value = this.getDataValue("total_payout");
                return value ? Number(value) : 0;
            },
        },
        is_winner: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        revealed_tabs: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
            defaultValue: [],
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Ticket",
        tableName: "tickets",
        timestamps: true,
        underscored: true,
    }
);

// Define associations
Ticket.belongsTo(User, { foreignKey: "user_id" });
Ticket.belongsTo(GameBox, { foreignKey: "game_box_id" });
User.hasMany(Ticket, { foreignKey: "user_id" });
GameBox.hasMany(Ticket, { foreignKey: "game_box_id" });

export default Ticket;
