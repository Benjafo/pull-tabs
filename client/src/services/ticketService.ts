import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export const SymbolType = {
  SKULL: 1,
  TREASURE: 2,
  SHIP: 3,
  ANCHOR: 4,
  COMPASS: 5,
  MAP: 6,
} as const;

export type SymbolType = typeof SymbolType[keyof typeof SymbolType];

export interface WinningLine {
  lineNumber: number;
  positions: number[];
  symbols: number[];
  prize: number;
}

export interface Ticket {
  id: string | number;
  gameBoxId: string | number;
  symbols?: number[];
  winningLines?: WinningLine[];
  totalPayout?: number;
  isWinner?: boolean;
  createdAt: string;
  revealedTabs?: number[];
  isFullyRevealed?: boolean;
}

export interface PurchaseResponse {
  message: string;
  ticket: {
    id: number;
    gameBoxId: number;
    createdAt: string;
  };
}

export interface RevealResponse {
  message: string;
  tab: {
    index: number;
    symbols: number[];
    winDetected: boolean;
  };
  ticket: {
    id: number;
    revealedTabs: boolean[]; // Boolean array where index represents tab position
    isFullyRevealed: boolean;
    symbols?: number[];
    winningLines?: WinningLine[];
    totalPayout?: number;
    isWinner?: boolean;
  };
  totalPayout?: number;
}

class TicketService {
  async purchaseTicket(): Promise<PurchaseResponse> {
    const response = await api.post<PurchaseResponse>(API_ENDPOINTS.TICKETS.PURCHASE);
    return response.data;
  }

  async getTicket(id: string): Promise<Ticket> {
    const response = await api.get<{ ticket: Ticket }>(API_ENDPOINTS.TICKETS.GET(id));
    return response.data.ticket;
  }

  async revealTab(ticketId: string | number, tabNumber: number): Promise<RevealResponse> {
    // Backend expects tabIndex (0-based) instead of tabNumber (1-based)
    const tabIndex = tabNumber - 1;
    const response = await api.post<RevealResponse>(
      API_ENDPOINTS.TICKETS.REVEAL(ticketId.toString()),
      { tabIndex }
    );
    return response.data;
  }
}

export default new TicketService();