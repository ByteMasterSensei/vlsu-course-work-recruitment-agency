import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    phone?: string;
    role: string;
  };
}

class AuthService {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  private setUser(user: AuthResponse['user']): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);
    this.setAuthToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
    this.setUser(response.data.user);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
    this.setAuthToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
    this.setUser(response.data.user);
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {
      refreshToken,
    });
    this.setAuthToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
    this.setUser(response.data.user);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAuthHeader(): string | null {
    const token = this.getAuthToken();
    return token ? `Bearer ${token}` : null;
  }
}

export const authService = new AuthService();

