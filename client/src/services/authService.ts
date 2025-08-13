import { API_ENDPOINTS } from "../config/constants";
import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username?: string; // Optional, for backwards compatibility
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async verifyToken(): Promise<User> {
    const response = await api.get<{ user: User }>(API_ENDPOINTS.AUTH.VERIFY);
    return response.data.user;
  }

  async getUserProfile(): Promise<User> {
    const response = await api.get<User>(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  }
}

export default new AuthService();
