import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store';
import { authService, User } from '../services/AuthService';
import { setAuthenticated, setUserData, userLoggedOut } from '../ReduxStore/UserstateSlice';
import { Logger, LogLevel } from '../Logger/Logger';

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const userId = useSelector((state: RootState) => state.user.userId);
  const userEmail = useSelector((state: RootState) => state.user.userEmail);
  const display_name = useSelector((state: RootState) => state.user.display_name);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        Logger('Checking authentication status...', LogLevel.Debug);
        
        // Check if we have stored auth data
        if (authService.isAuthenticated()) {
          Logger('Found stored user data, verifying with server...', LogLevel.Debug);
          // We have stored user data, but let's verify with server
          const isStillAuthenticated = await authService.checkAuthStatus();
          if (isStillAuthenticated) {
            const user: User | null = authService.getUser();
            if (user) {
              // Update Redux state with stored user data
              dispatch(setUserData({
                userId: user.userId,
                username: user.email, // Use email as username for now
                userEmail: user.email,
                display_name: user.display_name
              }));
              dispatch(setAuthenticated(true));
              Logger('User authenticated from stored data', LogLevel.Info);
            }
          } else {
            // Server says we're not authenticated, clear local data
            authService.clearAuthData();
            dispatch(userLoggedOut());
            Logger('User authentication expired', LogLevel.Debug);
          }
        } else {
          Logger('No stored user data, checking server...', LogLevel.Debug);
          // No stored data, try to refresh from server
          const refreshed = await authService.refreshAuth();
          if (refreshed) {
            const user: User | null = authService.getUser();
            if (user) {
              dispatch(setUserData({
                userId: user.userId,
                username: user.email, // Use email as username for now
                userEmail: user.email,
                display_name: user.display_name
              }));
              dispatch(setAuthenticated(true));
              Logger('User authenticated from server refresh', LogLevel.Info);
            }
          } else {
            dispatch(userLoggedOut());
            Logger('User not authenticated', LogLevel.Debug);
          }
        }
      } catch (error) {
        Logger(`Auth check failed: ${error}`, LogLevel.Error);
        dispatch(userLoggedOut());
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      console.log("response", response);
      if (response.success && response.user) {
        // Update Redux state with focused actions
        dispatch(setUserData({
          userId: response.user.userId,
          username: response.user.email, // Use email as username for now
          userEmail: response.user.email,
          display_name: response.user.display_name
        }));
        dispatch(setAuthenticated(true));
        
        Logger(`User ${response.user.email} logged in successfully`, LogLevel.Info);
        return true;
      }
      return false;
    } catch (error) {
      Logger(`Login failed: ${error}`, LogLevel.Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      dispatch(userLoggedOut());
      Logger('User logged out successfully', LogLevel.Info);
    } catch (error) {
      Logger(`Logout failed: ${error}`, LogLevel.Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get auth headers for API calls
  const getAuthHeaders = (): HeadersInit => {
    return authService.getAuthHeaders();
  };

  return {
    isAuthenticated,
    userId,
    userEmail,
    display_name,
    isLoading,
    login,
    logout,
    getAuthHeaders
  };
};
