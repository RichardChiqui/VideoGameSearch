import React, { useState, useEffect, useRef } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import { loadUserFriends } from '../../../NetworkCalls/FetchCalls/loadUserFriends';
import '../../../StylingSheets/headerNavBarStyles.css';
import { userLoggedIn } from '../../../ReduxStore/UserstateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store';
import { Logger, LogLevel } from '../../../Logger/Logger';

// Define TypeScript interface for user friend
interface UserFriend {
    id: number;
    username: string;
}

const MessageBubble = () => {
    const [messageWindowVisible, setMessageWindowVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const messageRef = useRef<HTMLDivElement>(null);
    const [userFriends, setUserFriends] = useState<UserFriend[]>([]);
    const userId = useSelector((state: RootState) => state.user.userId);
    const numOfFriends = useSelector((state: RootState) => state.user.numberOfCurrentFriends);
    const numOfFriendRequests = useSelector((state: RootState) => state.user.numberOfCurrentFriendRequests);
    const dispatch = useDispatch();

    // Toggle message window visibility
    const handleIconClick = () => {
        setMessageWindowVisible(prevState => !prevState);
    };

    // Set selected user when clicked
    const handleUserClick = (username: string) => {
        setSelectedUser(username);
    };

    // Close message window when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
            setMessageWindowVisible(false);
        }
    };

    // Fetch user friends when user data changes
    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const userFriendData = await loadUserFriends(userId);
                const friendsMap = userFriendData.friend.map((friend: UserFriend) => ({
                    id: friend.id,
                    username: friend.username
                }));
                setUserFriends(friendsMap);
            } catch (err) {
                Logger(`Failed to load user ${userId}'s friends: ${err}`, LogLevel.Error);
            }
        };

        fetchUserFriends();
    }, [userLoggedIn, numOfFriends]);

    // Add and clean up event listener for clicks outside the message window
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="message-bubble-container">
            <div className="icon-container" onClick={handleIconClick}>
                <ChatIcon className="chat-icon" />
            </div>
            {messageWindowVisible && (
                <div className="message-window" ref={messageRef}>
                    <div className="chat-column left">
                        <div className="chat-title">Chats</div>
                        <div className="user-list">
                            {userFriends.map(user => (
                                <div
                                    key={user.id}
                                    className="user"
                                    onClick={() => handleUserClick(user.username)}
                                >
                                    {user.username}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chat-column right">
                        <div className="chat-column-username">{selectedUser}</div>
                        <div className="message-input">
                            <input type="text" placeholder={`Message ${selectedUser}`} />
                            <button>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
