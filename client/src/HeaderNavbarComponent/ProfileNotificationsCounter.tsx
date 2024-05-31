import React from 'react';
import Badge from './PorfileIcon'; // Import the Badge component
import { useDispatch } from 'react-redux';
import { setNumberOfNotifications } from './NotificationsSlice';

const Avatar: React.FC = () => {
  const friendRequestCount: number = 2; // This would be the actual count of friend requests

  const dispatch = useDispatch();

  dispatch(setNumberOfNotifications(1));

  return (
    <div>
      <Badge count={friendRequestCount} />
    </div>
  );
};

export default Avatar;
