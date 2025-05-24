import { httpClient } from '@/shared/services/httpClient';
import { apiService } from '@/shared/services/apiService';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  RefreshTokenResponse, 
  PasswordReset,
  User
} from '../types/auth.types';

class AuthApiService {
  private readonly baseUrl = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post(`${this.baseUrl}/login`, credentials);
    return response.data as AuthResponse;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await httpClient.post(`${this.baseUrl}/register`, userData);
    return response.data as AuthResponse;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await httpClient.post(`${this.baseUrl}/refresh`, {
      refreshToken
    });
    return response.data as RefreshTokenResponse;
  }

  async logout(): Promise<void> {
    await httpClient.post(`${this.baseUrl}/logout`);
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/verify-email`, { token });
    return response.data as { message: string };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/password-reset-request`, { email });
    return response.data as { message: string };
  }

  async resetPassword(data: PasswordReset): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/password-reset`, data);
    return response.data as { message: string };
  }

  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get(`${this.baseUrl}/me`);
    return response.data as User;
  }

  async updateProfile(userData: Partial<RegisterData>): Promise<User> {
    const response = await httpClient.put(`${this.baseUrl}/profile`, userData);
    return response.data as User;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await httpClient.put(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data as { message: string };
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/resend-verification`);
    return response.data as { message: string };
  }
}

export const authApi = new AuthApiService(); 