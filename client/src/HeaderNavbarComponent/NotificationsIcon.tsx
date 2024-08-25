import React, { useState, useEffect, useRef } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './headerNavBarStyles.css';
import FriendRequestComponent from './FriendRequestComponent/FriendRequest';
import { loadUserFriendRequests } from '../FetchCalls/loadUserFriendRequests';
import { userLoggedIn } from '../HomePageComponent/UserstateSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../Store';

interface friendRequest {
    id: number;
    username: string;
  }
const NotificationsIconComponent = () => {
    const [notifWindowVisible, setNotifWindowVisible] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const userId = useSelector((state: RootState) => state.user.userId);
    const [friendRequests, setFriendRequests] = useState<friendRequest[]>([]);
    const handleClickOutside = (event: MouseEvent) => {
        if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
            setNotifWindowVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        console.log("attempting to load FR's")
   
        const fetchUserFriends = async () => {
          try {
            const usersData = await loadUserFriendRequests(userId);
            if (usersData.users.length > 0) {
                console.log("what it loaded frs")
              const formattedUsers = usersData.users.map((user: friendRequest) => ({
                fk_recieveruserid: user.id,
                username: user.username
              }));
              console.log("Formatted Users:", formattedUsers);
              setFriendRequests(formattedUsers);
            }
          } catch (err) {
            console.log('Failed to load users Frs:', err);
          }
        };
  
        fetchUserFriends();
      
    }, [userLoggedIn]);

    // Handle accept action
  const handleAccept = (id: number) => {
    setFriendRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id)
    );
  };

  // Handle reject action
  const handleReject = (id: number) => {
    setFriendRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id)
    );
  };
    return (
        <div>
          <NotificationsIcon onClick={() => setNotifWindowVisible(!notifWindowVisible)} />
          {notifWindowVisible && (
            <div ref={notifRef} className="notif-window">
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <div key={request.id} className="fr-container">
                    <p>{request.username} request to follow you</p>
                    <button  onClick={() => handleAccept(request.id)} className="accept-button">Accept</button>
                    <button  onClick={() => handleAccept(request.id)} className="reject-button">Reject</button>
                  </div>
                ))
              ) : (
                <p>No new friend requests</p>
              )}
            </div>
          )}
        </div>
      );
};

export default NotificationsIconComponent;
