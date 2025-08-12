// Association type declarations for Sequelize models
import type { User } from "./User";
import type { UserStatistics } from "./UserStatistics";
import type { Ticket } from "./Ticket";
import type { GameBox } from "./GameBox";

declare module "./User" {
    interface User {
        UserStatistic?: UserStatistics;
        Tickets?: Ticket[];
    }
}

declare module "./UserStatistics" {
    interface UserStatistics {
        User?: User;
    }
}

declare module "./Ticket" {
    interface Ticket {
        User?: User;
        GameBox?: GameBox;
    }
}

declare module "./GameBox" {
    interface GameBox {
        Tickets?: Ticket[];
    }
}

export {};