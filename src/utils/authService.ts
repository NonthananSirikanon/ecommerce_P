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
    // ทำการ logout โดยการลบ tokens ที่เก็บไว้ใน localStorage
    // (ไม่ต้องเรียก API เนื่องจาก backend ไม่มี /auth/logout endpoint)
    this.clearTokens();
    
    // อาจจะเพิ่ม logic อื่น ๆ ถ้าจำเป็น เช่น clear cache หรือ redirect
    console.log('User logged out successfully');
  }

  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // ตรวจสอบว่า backend มี /auth/refresh endpoint หรือไม่
      // ถ้าไม่มี จะใช้ token เดิมต่อไปชั่วคราว
      try {
        const response = await apiClient.post<{ token: string }>('/auth/refresh', {
          refreshToken,
        });

        localStorage.setItem('token', response.token);
        return response.token;
      } catch {
        // ถ้า API ไม่มี endpoint นี้ ให้ใช้ token เดิม
        console.warn('Refresh token API not available, using existing token');
        const existingToken = this.getToken();
        if (existingToken) {
          return existingToken;
        }
        throw new Error('No valid token available');
      }
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