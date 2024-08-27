import React from 'react';
import Badge from './PorfileIcon'; // Import the Badge component
import { setNumberOfNotifications } from '../../ReduxStore/NotificationsSlice';

import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../Store';

const Avatar: React.FC = () => {
  const friendRequestCount: number = 0; // This would be the actual count of friend requests

  const dispatch = useDispatch();

  dispatch(setNumberOfNotifications(1));

  const numOfFriendRequests = useSelector((state: RootState) => state.user.numberOfCurrentFriendRequests);

  return (
    <div>
      <Badge count={numOfFriendRequests} />
    </div>
  );
};

export default Avatar;
