// ===== REDUX USAGE EXAMPLES =====
// This file shows how to use the new focused Redux actions

import { useDispatch } from 'react-redux';
import { 
  setAuthenticated, 
  setUserData, 
  setFriendRequestCount,
  userLoggedOut 
} from '../ReduxStore/UserstateSlice';

// ===== EXAMPLE 1: LOGIN USER =====
export const loginUserExample = () => {
  const dispatch = useDispatch();
  
  // Instead of the old way:
  // dispatch(userLoggedIn({ 
  //   isAuthenticated: true, 
  //   userId: 123, 
  //   username: 'john', 
  //   numberOfCurrentFriendRequests: 5 
  // }));
  
  // Use the new focused actions:
  dispatch(setUserData({
    userId: 123,
    username: 'john@example.com', // Use email as username for now
    userEmail: 'john@example.com',
    display_name: 'John Doe'
  }));
  dispatch(setAuthenticated(true));
  
  // Friend requests are loaded separately
  dispatch(setFriendRequestCount(5));
};

// ===== EXAMPLE 2: UPDATE USER DATA =====
export const updateUserDataExample = () => {
  const dispatch = useDispatch();
  
  // Update only user data without affecting authentication status
  dispatch(setUserData({
    userId: 123,
    username: 'john.updated@example.com', // Use email as username for now
    userEmail: 'john.updated@example.com',
    display_name: 'John Updated'
  }));
};

// ===== EXAMPLE 3: UPDATE FRIEND REQUESTS =====
export const updateFriendRequestsExample = () => {
  const dispatch = useDispatch();
  
  // Update friend request count independently
  dispatch(setFriendRequestCount(10));
};

// ===== EXAMPLE 4: LOGOUT =====
export const logoutExample = () => {
  const dispatch = useDispatch();
  
  // Single action clears everything
  dispatch(userLoggedOut());
};

// ===== EXAMPLE 5: COMPONENT USAGE =====
export const ComponentExample = () => {
  const dispatch = useDispatch();
  
  const handleLogin = async (email: string, password: string) => {
    // 1. Authenticate user
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const userData = await response.json();
      
      // 2. Update Redux state with focused actions
      dispatch(setUserData({
        userId: userData.id,
        username: userData.email, // Use email as username for now
        userEmail: userData.email,
        display_name: userData.display_name
      }));
      dispatch(setAuthenticated(true));
      
      // 3. Load friend data separately
      const friendRequests = await fetch('/api/friend-requests/count');
      const friendCount = await fetch('/api/friends/count');
      
      if (friendRequests.ok) {
        const requests = await friendRequests.json();
        dispatch(setFriendRequestCount(requests.count));
      }
    }
  };
  
  return null; // Your component JSX here
};
