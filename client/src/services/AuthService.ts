import { Logger, LogLevel } from '../Logger/Logger';
import { REGIONS_ENUMS } from '../enums/RegionsEnums';

export interface User {
  userId: number;
  email: string;
  display_name: string;
  region: REGIONS_ENUMS;
  profile_description: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  /**
   * Store user data in localStorage (JWT token is stored in HTTP-only cookie)
   */
  setAuthData(token: string, user: User): void {
    try {
      // Don't store the token in localStorage since it's in HTTP-only cookie
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      Logger('User data stored successfully', LogLevel.Debug);
    } catch (error) {
      Logger(`Failed to store user data: ${error}`, LogLevel.Error);
    }
  }

  /**
   * Get stored JWT token (not used with HTTP-only cookies)
   */
  getToken(): string | null {
    // JWT token is stored in HTTP-only cookie, not accessible from client
    return null;
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
   * Since we're using HTTP-only cookies, we can't check the token directly
   * We'll rely on the server to validate the token via the refresh endpoint
   */
  isAuthenticated(): boolean {
    // Check if we have user data stored (indicates previous successful login)
    const user = this.getUser();
    return user !== null;
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
    return {
      'Content-Type': 'application/json'
      // JWT token is automatically sent via HTTP-only cookie
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
        // Store user data (JWT is already in HTTP-only cookie) 
   
        this.setAuthData('', data.user);
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
          // Store user data (JWT is already in HTTP-only cookie)
          this.setAuthData('', data.user);
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

  /**
   * Check if user is still authenticated by making a test request
   */
  async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:5000/auth/verify', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        if (data.user) {
          // Update stored user data
          this.setAuthData('', data.user);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      Logger(`Auth status check failed: ${error}`, LogLevel.Error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
