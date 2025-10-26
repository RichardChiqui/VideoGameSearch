import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import { loadUserFriends } from '../../../NetworkCalls/FetchCalls/loadUserFriends';
import { loadUserMessages } from '../../../NetworkCalls/FetchCalls/loadUserMessages';
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

// Define TypeScript interface for messages
interface Message {
    id?: number;
    fromUserId: number;
    toUserId: number;
    message: string;
    timestamp: string;
}


const MessageBubble = forwardRef<{
    addNewUser: (user: UserFriend) => void;
    addNewMessage: (message: Message) => void;
}, {}>((props, ref) => {
    const [messageWindowVisible, setMessageWindowVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<number>(0);
    const messageRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [userFriends, setUserFriends] = useState<UserFriend[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const userId = useSelector((state: RootState) => state.user.userId);
    const numOfFriends = useSelector((state: RootState) => state.user.numberOfCurrentFriends);
    const numOfFriendRequests = useSelector((state: RootState) => state.user.numberOfCurrentFriendRequests);
    const dispatch = useDispatch();

    // Toggle message window visibility
    const handleIconClick = () => {
        setMessageWindowVisible(prevState => !prevState);
    };

    // Set selected user when clicked
    const handleUserClick = (username: string, userId: number) => {
        setSelectedUser(username);
        setSelectedUserId(userId);
    };

    // Handle message input change
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    };

    // Handle message submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedUserId) {
            // Add message to local state immediately for better UX
            const message: Message = {
                fromUserId: userId,
                toUserId: selectedUserId,
                message: newMessage.trim(),
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, message]);
            setNewMessage('');
            
            // Here you would typically send the message to the server
            Logger(`Message sent to ${selectedUser}: ${newMessage}`, LogLevel.Info);
        }
    };

    // Close message window when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
            setMessageWindowVisible(false);
        }
    };

    // Function to add a new user to friends list (called from SearchResults)
    const addNewUser = (user: UserFriend) => {
        setUserFriends(prev => {
            // Check if user already exists
            if (prev.find(friend => friend.id === user.id)) {
                return prev;
            }
            return [...prev, user];
        });
    };

    // Function to add a new message (called from SearchResults)
    const addNewMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
        // Auto-select the user if not already selected
        if (selectedUserId !== message.toUserId) {
            setSelectedUser(message.toUserId.toString()); // You might need to get username from userFriends
            setSelectedUserId(message.toUserId);
        }
    };

    // Fetch user friends when user data changes
    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const userFriendData = await loadUserFriends(userId);
                Logger("userfriends: " + JSON.stringify(userFriendData), LogLevel.Debug);
                const friendsMap = (userFriendData.users || []).map((friend: UserFriend) => ({
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

    // Load messages when a user is selected
    useEffect(() => {
        if (selectedUserId) {
            const fetchMessages = async () => {
                try {
                    const messagesData = await loadUserMessages(userId, selectedUserId);
                    Logger("messages: " + JSON.stringify(messagesData), LogLevel.Debug);
                    setMessages(messagesData.messages || []);
                } catch (err) {
                    Logger(`Failed to load messages: ${err}`, LogLevel.Error);
                }
            };
            fetchMessages();
        }
    }, [selectedUserId, userId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Expose functions to parent components
    useImperativeHandle(ref, () => ({
        addNewUser,
        addNewMessage
    }));

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
                                    onClick={() => handleUserClick(user.username, user.id)}
                                >
                                    {user.username}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chat-column right">
                        <div className="chat-column-username">{selectedUser}</div>
                        <div className="messages">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message-bubble ${
                                        message.fromUserId === userId ? 'sent' : 'received'
                                    }`}
                                >
                                    {message.message}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSubmit} className="message-input">
                            <input 
                                type="text" 
                                placeholder={`Message ${selectedUser}`}
                                value={newMessage}
                                onChange={handleMessageChange}
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
