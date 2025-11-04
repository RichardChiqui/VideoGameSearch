import React, { useState, useEffect, useRef } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import '../../StylingSheets/headerNavBarStyles.css';
import FriendRequestComponent from './FriendRequestComponent/FriendRequest';
import { loadUserFriendRequests } from '../../NetworkCalls/FetchCalls/loadUserFriendRequests';
import { decrementFriendRequest, incrementNumOfFriends, userLoggedIn } from '../../ReduxStore/UserstateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { deleteFriendRequest } from '../../NetworkCalls/deleteCalls/deleteFriendRequest';
import { createNewFriend } from '../../NetworkCalls/createCalls/createNewFriend';
import { Logger, LogLevel } from '../../Logger/Logger';

// Define TypeScript interface for friend request
interface FriendRequest {
    id: number;
    username: string;
}

const NotificationsIconComponent = () => {
    const [notifWindowVisible, setNotifWindowVisible] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Select user ID and number of friend requests from the Redux store
    const userId = useSelector((state: RootState) => state.user.userId);
    const numOfFrs = useSelector((state: RootState) => state.user.numberOfCurrentFriendRequests);

    // State to store friend requests
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    
    // Function to handle clicks outside the notification window
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

    const dispatch = useDispatch();

    // Fetch user friend requests on component mount or when user data changes
    useEffect(() => {
        const fetchUserFriends = async () => {
            try { 
                const userFriendRequestsData = await loadUserFriendRequests(userId);
                Logger("userfirendrequestsdata: " + JSON.stringify(userFriendRequestsData), LogLevel.Debug);
                const friendRequestsMap = (userFriendRequestsData.FriendRequests || []).map((fr: FriendRequest) => ({
                    id: fr.id,
                    username: fr.username
                }));
                setFriendRequests(friendRequestsMap);
            } catch (err) {
                Logger(`Failed to load user ${userId} friend requests: ${err}`, LogLevel.Error);
            }
        };

        fetchUserFriends();
    }, [userLoggedIn, numOfFrs]);

    // Handle accept action
    const handleAccept = (fromUserId: number, toUserId: number) => {
        const sendCreateFR = async () => {
            try {
                const createNewFriendData = await createNewFriend(fromUserId, toUserId);
                const newFriendRelMap = createNewFriendData.users.map((newFriendRel: FriendRequest) => ({
                    fk_recieveruserid: newFriendRel.id,
                    username: newFriendRel.username
                }));
                setFriendRequests(newFriendRelMap);
                dispatch(incrementNumOfFriends());
            } catch (err) {
                Logger(`Failed to create new friend: ${err}`, LogLevel.Error);
            }
        };
        sendCreateFR();
    };

    // Handle reject action
    const handleReject = (id: number) => {
        const sendDeleteFR = async () => {
            try {
                const deleteFrData = await deleteFriendRequest(userId);
                const deleteFrMap = deleteFrData.users.map((user: FriendRequest) => ({
                    fk_recieveruserid: user.id,
                    username: user.username
                }));
                dispatch(decrementFriendRequest());
            } catch (err) {
                Logger(`Failed to delete friend request: ${err}`, LogLevel.Error);
            }
        };
        sendDeleteFR();
    };

    return (
        <div>
            <NotificationsIcon onClick={() => setNotifWindowVisible(!notifWindowVisible)} sx={{ color: 'white' }} />
            {notifWindowVisible && (
                <div ref={notifRef} className="notif-window">
                    {friendRequests.length > 0 ? (
                        friendRequests.map((request) => (
                            <div key={request.id} className="fr-container">
                                <p>{request.username} request to follow you</p>
                                <button onClick={() => handleAccept(request.id, userId)} className="accept-button">Accept</button>
                                <button onClick={() => handleReject(request.id)} className="reject-button">Reject</button>
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
