import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store';
import { setFriendRequestCount, setCurrentNumberOfFriends } from '../ReduxStore/UserstateSlice';
import { apiClient } from '../utils/apiClient';
import { Logger, LogLevel } from '../Logger/Logger';

export const useFriends = () => {
  const dispatch = useDispatch();
  const numberOfCurrentFriendRequests = useSelector((state: RootState) => state.user.numberOfCurrentFriendRequests);
  const numberOfCurrentFriends = useSelector((state: RootState) => state.user.numberOfCurrentFriends);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  // Load friend data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadFriendData();
    }
  }, [isAuthenticated]);

  const loadFriendData = async () => {
    try {
      // Load friend requests count
      const friendRequestsResponse = await apiClient.get('/user/friend-requests/count');
      if (friendRequestsResponse.success) {
        dispatch(setFriendRequestCount(friendRequestsResponse.data.count));
      }

      // Load friends count
      const friendsResponse = await apiClient.get('/user/friends/count');
      if (friendsResponse.success) {
        dispatch(setCurrentNumberOfFriends(friendsResponse.data.count));
      }

      Logger('Friend data loaded successfully', LogLevel.Debug);
    } catch (error) {
      Logger(`Failed to load friend data: ${error}`, LogLevel.Error);
    }
  };

  return {
    numberOfCurrentFriendRequests,
    numberOfCurrentFriends,
    loadFriendData
  };
};
