import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import { loadUserFriends } from '../../../NetworkCalls/FetchCalls/loadUserFriends';
import { loadUserMessages } from '../../../NetworkCalls/FetchCalls/loadUserMessages';
import '../../../StylingSheets/headerNavBarStyles.css';
import '../../../StylingSheets/messageBubbleStyles.css';
import { userLoggedIn } from '../../../ReduxStore/UserstateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store';
import { Logger, LogLevel } from '../../../Logger/Logger';
import { loadChatHistoryRecepients } from '../../../NetworkCalls/FetchCalls/ChatHistory/loadChatHistoryRecepients';
import { ChatHistoryRecepient } from '../../../models/ChatHistoryRecepient';
import { Message } from '../../../models/Message';
// Define TypeScript interface for messages



const MessageBubble = forwardRef<{
    addNewUser: (user: ChatHistoryRecepient) => void;
    addNewMessage: (message: Message) => void;
}, {}>((props, ref) => {
    const [messageWindowVisible, setMessageWindowVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<number>(0);
    const [currentView, setCurrentView] = useState<'recipients' | 'chat'>('recipients'); // New state for view mode
    const messageRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chatHistoryRecepients, setChatHistoryRecepients] = useState<ChatHistoryRecepient[]>([]);
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
        setCurrentView('chat'); // Switch to chat view when user is selected
        Logger(`Switched to chat view with user: ${username} (ID: ${userId})`, LogLevel.Info);
    };

    // Function to go back to recipients view
    const handleBackToRecipients = () => {
        setCurrentView('recipients');
        setSelectedUser('');
        setSelectedUserId(0);
        setMessages([]); // Clear messages when going back
        Logger('Switched back to recipients view', LogLevel.Info);
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
    const addNewUser = (user: ChatHistoryRecepient) => {
        setChatHistoryRecepients(prev => {
            // Check if user already exists
            if (prev.find(friend => friend.fk_touserid === user.fk_touserid)) {
                return prev;
            }
            return [...prev, user];
        });
    };

    // Function to add a new message (called from SearchResults)
    const addNewMessage = (message: Message) => {
        console.log("Adding new message:", message);
        
        // Determine which user to select based on the message direction
        const targetUserId = message.fromUserId === userId ? message.toUserId : message.fromUserId;
        
        // Auto-select the user if not already selected
        if (selectedUserId !== targetUserId) {
            // Find the username from userFriends
            const targetUser = chatHistoryRecepients.find(friend => friend.fk_touserid === targetUserId);
            if (targetUser) {
                setSelectedUser(targetUser.todisplayname);
                setSelectedUserId(targetUserId);
                setCurrentView('chat'); // Switch to chat view when new message arrives
                Logger(`Auto-selected user: ${targetUser.todisplayname} (ID: ${targetUserId})`, LogLevel.Info);
            } else {
                // If user not found in friends list, just set the ID and let the useEffect handle loading
                setSelectedUserId(targetUserId);
                setCurrentView('chat'); // Switch to chat view when new message arrives
                Logger(`Auto-selected user ID: ${targetUserId} (username not found in friends list)`, LogLevel.Warn);
            }
        }
        
        // Add the message to the current messages list
        setMessages(prev => [...prev, message]);
        Logger(`Message added to local state. Total messages: ${messages.length + 1}`, LogLevel.Debug);
        
        // If we're switching to a new user, the useEffect will handle loading messages
        // If we're staying with the same user, we just added the message locally
        // This ensures the UI updates immediately while maintaining data consistency
    };

    // Fetch user friends when user data changes
    useEffect(() => {
        const fetchChatHistoryRecepients = async () => {
            try {
                const chatHistoryRecepientsData = await loadChatHistoryRecepients(userId);
                Logger("chatHistoryRecepients: " + JSON.stringify(chatHistoryRecepientsData), LogLevel.Debug);
                
                if (chatHistoryRecepientsData.success && chatHistoryRecepientsData.recepients) {
                    // Map the recipients to UserFriend format
                    const chatHistoryRecepientsMap = chatHistoryRecepientsData.recepients.map((recipient: ChatHistoryRecepient) => ({
                        fk_touserid:  recipient.fk_touserid,
                        todisplayname: recipient.todisplayname
                    }));
                    setChatHistoryRecepients(chatHistoryRecepientsMap);
                } else {
                    Logger(`Failed to load chat history recipients: ${chatHistoryRecepientsData.error}`, LogLevel.Error);
                    setChatHistoryRecepients([]);
                }
            } catch (err) {
                Logger(`Failed to load chat history recepients: ${err}`, LogLevel.Error);
                setChatHistoryRecepients([]);
            }
        };

        fetchChatHistoryRecepients();
    }, [userLoggedIn, numOfFriends]);

    // Load messages when a user is selected
    useEffect(() => {
        if (selectedUserId) {
            const fetchMessages = async () => {
                try {
                    const messagesData = await loadUserMessages(userId, selectedUserId);
                    Logger("messages: " + JSON.stringify(messagesData), LogLevel.Debug);
                    
                    if (messagesData.success && messagesData.users) {
                        // Map the users array to messages format
                        const mappedMessages = messagesData.users.map((user: any) => ({
                            fromUserId: user.fk_fromuserid,
                            toUserId: user.fk_touserid,
                            message: user.textmessage,
                            timestamp: user.timestamp || new Date().toISOString()
                        }));
                        setMessages(mappedMessages);
                    } else {
                        Logger(`Failed to load messages: ${messagesData.error}`, LogLevel.Error);
                        setMessages([]);
                    }
                } catch (err) {
                    Logger(`Failed to load messages: ${err}`, LogLevel.Error);
                    setMessages([]);
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
                    {currentView === 'recipients' ? (
                        // Recipients view - show only the list of chat history recipients
                        <div className="chat-column recipients-view">
                            <div className="chat-title">Chat History</div>
                            <div className="user-list">
                                {chatHistoryRecepients.length > 0 ? (
                                    chatHistoryRecepients.map(user => (
                                        <div
                                            key={user.fk_touserid}
                                            className="user recipient-item"
                                            onClick={() => handleUserClick(user.todisplayname, user.fk_touserid)}
                                        >
                                            <div className="recipient-name">{user.todisplayname}</div>
                                            <div className="recipient-arrow">→</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-recipients">
                                        <p>No chat history found</p>
                                        <p>Start a conversation to see it here!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Chat view - show the conversation with selected user
                        <>
                            <div className="chat-column left">
                                <div className="chat-title">
                                    <button 
                                        className="back-button" 
                                        onClick={handleBackToRecipients}
                                        title="Back to recipients"
                                    >
                                        ← Back
                                    </button>
                                    Chats
                                </div>
                                <div className="user-list">
                                    {chatHistoryRecepients.map(user => (
                                        <div
                                            key={user.fk_touserid}
                                            className={`user ${selectedUserId === user.fk_touserid ? 'selected' : ''}`}
                                            onClick={() => handleUserClick(user.todisplayname, user.fk_touserid)}
                                        >
                                            {user.todisplayname}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="chat-column right">
                                <div className="chat-column-username">{selectedUser}</div>
                                <div className="messages">
                                    {messages.length > 0 ? (
                                        messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`message-bubble ${
                                                    message.fromUserId === userId ? 'sent' : 'received'
                                                }`}
                                            >
                                                {message.message}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-messages">
                                            <p>No messages yet</p>
                                            <p>Start the conversation!</p>
                                        </div>
                                    )}
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
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
