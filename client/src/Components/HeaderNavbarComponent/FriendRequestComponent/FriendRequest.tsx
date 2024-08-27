import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import '../headerNavBarStyles.css';

interface FriendRequestComponentProps {
  username: string;
}

const FriendRequestComponent: React.FC<FriendRequestComponentProps> = ({ username }) => {
  return (
    <div className="fr-container">
      <p className="username">{username} requested to follow you</p>
      <div className="button-group">
        <button className="accept-button">Accept</button>
        <button className="reject-button">Reject</button>
      </div>
    </div>
  );
};

export default FriendRequestComponent;
