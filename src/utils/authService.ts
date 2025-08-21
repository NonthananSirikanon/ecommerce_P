import { apiClient } from './api';
import type { LoginCredentials, RegisterCredentials, LoginResponse, User } from '../types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  static async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    const registerPayload = {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      password: credentials.password,
    };
    
    const response = await apiClient.post<LoginResponse>('/auth/register', registerPayload);
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });

      localStorage.setItem('token', response.token);
      return response.token;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  static getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  static clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getStoredUser();
  }
}