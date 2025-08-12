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
    const response = await api.get<UserStats>(API_ENDPOINTS.STATS);
    return response.data;
  }

  async getCurrentGameBox(): Promise<GameBoxStatus> {
    const response = await api.get<GameBoxStatus>(API_ENDPOINTS.GAMEBOX.CURRENT);
    return response.data;
  }
}

export default new StatsService();