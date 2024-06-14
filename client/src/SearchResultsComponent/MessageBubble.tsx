import React, { useState, useEffect, useRef } from 'react';
import ChatIcon from '@mui/icons-material/Chat';

import './searchResultsStyles.css';

const MessageBubble = () => {
    const [messageWindowVisible, setMessageWindowVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const messageRef = useRef<HTMLDivElement>(null);

    const handleIconClick = () => {
        setMessageWindowVisible(!messageWindowVisible);
    };

    const handleUserClick = (username: string) => {
        setSelectedUser(username);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
            setMessageWindowVisible(false);
        }
    };

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
                    <div className="user-list">
                        <div className="user" onClick={() => handleUserClick("User 1")}>User 1</div>
                        <div className="user" onClick={() => handleUserClick("User 2")}>User 2</div>
                        <div className="user" onClick={() => handleUserClick("User 3")}>User 3</div>
                    </div>
                    <div className="message-input">
                        <input type="text" placeholder={`Message ${selectedUser}`} />
                        <button>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
