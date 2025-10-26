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
  const userName = useSelector((state: RootState) => state.user.userName);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have stored auth data
        if (authService.isAuthenticated()) {
          const user = authService.getUser();
          if (user) {
            // Update Redux state with stored user data
            dispatch(setUserData({
              userId: user.id,
              username: user.email, // Use email as username for now
              userEmail: user.email,
              userName: user.name
            }));
            dispatch(setAuthenticated(true));
            Logger('User authenticated from stored data', LogLevel.Info);
          }
        } else {
          // Try to refresh from server
          const refreshed = await authService.refreshAuth();
          if (refreshed) {
            const user = authService.getUser();
            if (user) {
              dispatch(setUserData({
                userId: user.id,
                username: user.email, // Use email as username for now
                userEmail: user.email,
                userName: user.name
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
          userId: response.user.id,
          username: response.user.email, // Use email as username for now
          userEmail: response.user.email,
          userName: response.user.name
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
    userName,
    isLoading,
    login,
    logout,
    getAuthHeaders
  };
};
