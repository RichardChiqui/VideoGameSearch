import { Logger, LogLevel } from '../Logger/Logger';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  /**
   * Store JWT token and user data in localStorage
   */
  setAuthData(token: string, user: User): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      Logger('Auth data stored successfully', LogLevel.Debug);
    } catch (error) {
      Logger(`Failed to store auth data: ${error}`, LogLevel.Error);
    }
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      Logger(`Failed to get token: ${error}`, LogLevel.Error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      Logger(`Failed to get user data: ${error}`, LogLevel.Error);
      return null;
    }
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      Logger(`Token validation error: ${error}`, LogLevel.Error);
      return false;
    }
  }

  /**
   * Clear stored auth data
   */
  clearAuthData(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      Logger('Auth data cleared successfully', LogLevel.Debug);
    } catch (error) {
      Logger(`Failed to clear auth data: ${error}`, LogLevel.Error);
    }
  }

  /**
   * Get headers for authenticated requests
   */
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Login user and store auth data
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch('http://localhost:5000/homepage/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      
      if (data.success && data.user) {
        // Store auth data for future use
        this.setAuthData('jwt_token', data.user); // We'll get the actual token from cookies
        Logger(`User ${data.user.email} logged in successfully`, LogLevel.Info);
        return data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      Logger(`Login failed: ${error}`, LogLevel.Error);
      throw error;
    }
  }

  /**
   * Logout user and clear auth data
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to clear server-side session
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      Logger(`Logout API call failed: ${error}`, LogLevel.Debug);
    } finally {
      // Always clear local data
      this.clearAuthData();
      Logger('User logged out successfully', LogLevel.Info);
    }
  }

  /**
   * Refresh auth data from server
   */
  async refreshAuth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:5000/auth/verify', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          this.setAuthData('jwt_token', data.user);
          return true;
        }
      }
      
      this.clearAuthData();
      return false;
    } catch (error) {
      Logger(`Auth refresh failed: ${error}`, LogLevel.Error);
      this.clearAuthData();
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
