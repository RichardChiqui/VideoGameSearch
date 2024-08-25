import React, { useState, useEffect, useRef } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import { loadUserFriends } from '../../FetchCalls/loadUserFriends';
import '../searchResultsStyles.css';
import { userLoggedIn } from '../../HomePageComponent/UserstateSlice';

interface UserFriend {
    id: number;
    username: string;
  }
const MessageBubble = () => {
    const [messageWindowVisible, setMessageWindowVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const messageRef = useRef<HTMLDivElement>(null);
    const [userFriends, setUserFriends] = React.useState<UserFriend[]>([]);

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
   
      const fetchUserFriends = async () => {
        try {
          const usersData = await loadUserFriends();
          if (usersData.users.length > 0) {
            const formattedUsers = usersData.users.map((user: UserFriend) => ({
              id: user.id,
              username: user.username
            }));
            console.log("Formatted Users:", formattedUsers);
            setUserFriends(formattedUsers);
          }
        } catch (err) {
          console.log('Failed to load users:', err);
        }
      };

      fetchUserFriends();
    
  }, [userLoggedIn]);

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
