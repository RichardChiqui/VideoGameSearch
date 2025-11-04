import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import '../../StylingSheets/headerNavBarStyles.css';
import FriendRequestComponent from './FriendRequestComponent/FriendRequest';
import { loadUserFriendRequests } from '../../NetworkCalls/FetchCalls/loadUserFriendRequests';
import { decrementFriendRequest, incrementNumOfFriends, userLoggedIn } from '../../ReduxStore/UserstateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { deleteFriendRequest } from '../../NetworkCalls/deleteCalls/deleteFriendRequest';
import { createNewFriend } from '../../NetworkCalls/createCalls/createNewFriend';
import { removeLinkRequestNotification } from '../../ReduxStore/NotificationsSlice';
import { Logger, LogLevel } from '../../Logger/Logger';

// Define TypeScript interface for friend request
interface FriendRequest {
    id: number;
    username: string;
}

const NotificationsIconComponent = () => {
    const navigate = useNavigate();
    const [notifWindowVisible, setNotifWindowVisible] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Select user ID and number of friend requests from the Redux store
    const userId = useSelector((state: RootState) => state.user.userId);
    const numOfFrs = useSelector((state: RootState) => state.user.numberOfCurrentFriendRequests);
    
    // Get link request notifications from Redux
    const linkRequestNotifications = useSelector((state: RootState) => state.notifications.linkRequestNotifications);

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

    const totalNotifications = friendRequests.length + linkRequestNotifications.length;

    const handleLinkRequestClick = (linkRequestId: number) => {
        // Remove the notification when clicked
        dispatch(removeLinkRequestNotification(linkRequestId));
        setNotifWindowVisible(false);
        // Use setTimeout to ensure navigation happens after state updates
        setTimeout(() => {
            navigate('/my-requests');
        }, 100);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <NotificationsIcon onClick={() => setNotifWindowVisible(!notifWindowVisible)} sx={{ color: 'white', cursor: 'pointer' }} />
                {totalNotifications > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            zIndex: 1000,
                            pointerEvents: 'none'
                        }}
                    >
                        {totalNotifications}
                    </div>
                )}
            </div>
            {notifWindowVisible && (
                <div ref={notifRef} className="notif-window">
                    {/* Link Request Notifications */}
                    {linkRequestNotifications.length > 0 && (
                        <>
                            <div style={{ padding: '10px', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', fontSize: '14px' }}>
                                New Link Requests
                            </div>
                            {linkRequestNotifications.map((linkRequest) => (
                                <div 
                                    key={linkRequest.id} 
                                    className="fr-container"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleLinkRequestClick(linkRequest.id);
                                    }}
                                >
                                    <p style={{ margin: 0, flex: 1, color: '#2C3E50' }}>
                                        Your newly created link request: <strong style={{ color: '#2C3E50', fontWeight: 'bold' }}>{linkRequest.game_name}</strong>
                                        {linkRequest.platform && <span style={{ color: '#2C3E50' }}> ({linkRequest.platform})</span>}
                                    </p>
                                </div>
                            ))}
                        </>
                    )}
                    
                    {/* Friend Requests */}
                    {friendRequests.length > 0 && (
                        <>
                            {linkRequestNotifications.length > 0 && (
                                <div style={{ padding: '10px', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>
                                    Friend Requests
                                </div>
                            )}
                            {friendRequests.map((request) => (
                                <div key={request.id} className="fr-container">
                                    <p>{request.username} request to follow you</p>
                                    <button onClick={() => handleAccept(request.id, userId)} className="accept-button">Accept</button>
                                    <button onClick={() => handleReject(request.id)} className="reject-button">Reject</button>
                                </div>
                            ))}
                        </>
                    )}
                    
                    {/* No notifications */}
                    {friendRequests.length === 0 && linkRequestNotifications.length === 0 && (
                        <p style={{ padding: '10px' }}>No new notifications</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsIconComponent;
