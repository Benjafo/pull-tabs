import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export interface UserStats {
  ticketsPlayed: number;
  totalWinnings: number;
  biggestWin: number;
  sessionsPlayed: number;
  winRate: number;
  lastPlayed: string | null;
}

export interface GameBoxStatus {
  id: string;
  totalTickets: number;
  remainingTickets: number;
  winnersRemaining: {
    [key: string]: number;
  };
  createdAt: string;
}

class StatsService {
  async getUserStats(): Promise<UserStats> {
    const response = await api.get<{ statistics: UserStats }>(API_ENDPOINTS.STATS);
    return response.data.statistics;
  }

  async getCurrentGameBox(): Promise<GameBoxStatus> {
    const response = await api.get<{ gameBox: GameBoxStatus }>(API_ENDPOINTS.GAMEBOX.CURRENT);
    return response.data.gameBox;
  }
}

export default new StatsService();