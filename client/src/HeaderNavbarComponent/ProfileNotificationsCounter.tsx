import React from 'react';
import Badge from './PorfileIcon'; // Import the Badge component
import { setNumberOfNotifications } from './NotificationsSlice';

import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../Store';

const Avatar: React.FC = () => {
  const friendRequestCount: number = 0; // This would be the actual count of friend requests

  const dispatch = useDispatch();

  dispatch(setNumberOfNotifications(1));

  const numOfFriendRequests = useSelector((state: RootState) => state.user.numberOfCurrentFriendRequests);
  console.log("test to see if this works:" + numOfFriendRequests);

  return (
    <div>
      <Badge count={numOfFriendRequests} />
    </div>
  );
};

export default Avatar;
