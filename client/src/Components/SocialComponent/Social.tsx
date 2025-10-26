import React, { useEffect, CSSProperties, useState, useRef, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { MainFiltersEnum } from '../../ENUMS';
import { loadAllUsers } from '../../NetworkCalls/FetchCalls/loadAllUsers';
import { userLoggedIn, receiveFriendRequest } from '../../ReduxStore/UserstateSlice';
import { useSocket } from '../../hooks/useSocket'
import { useMessaging } from '../../hooks/useMessaging'
import { displayPopUpMethod } from '../../ReduxStore/LoginSlice';
import ChatWindow from '../HomePageComponent/MessageComponent/MessageBubble'; // Import the MessageBubble component
import { loadUserFriends } from '../../NetworkCalls/FetchCalls/loadUserFriends';
import '../../StylingSheets/socialStyles.css';
import { Logger, LogLevel } from '../../Logger/Logger';
import {loadUserMessages} from '../../NetworkCalls/FetchCalls/loadUserMessages';
import { messagingService } from '../../services/MessagingService';

export type SearchResultsItemType = {
  id: number;
  name: string;
};

interface UserData {
  id: number;
  username: string;
  email: string;
}

interface MessageData {
  fromUserId: number;
  toUserId: number;
  message: string;
  timestamp?: string;
}

interface SearchResultsProps {
  onButtonClick: () => void;
  buttonClicked: boolean;
}
interface UserFriend {
    id: number;
    username: string;
}

export default function Social({ onButtonClick, buttonClicked }: SearchResultsProps) {
  const discoverFilter = useSelector((state: RootState) => state.mainfilter.discoverSubFilter);
  const userId = useSelector((state: RootState) => state.user.userId);
  const isLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
  const userLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
  const newMessage = useSelector((state: RootState) => state.user.newMessage);
  const dispatch = useDispatch();
  const { sendMessage } = useMessaging();
  const numOfFriends = useSelector((state: RootState) => state.user.numberOfCurrentFriends);
  const [userFriends, setUserFriends] = useState<UserFriend[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const handleUserClick = (username: string, userId:number) => {
      setSelectedUser(username);
      setSelectedUserId(userId);
  };
  const [peoplesList, setPeoplesList] = React.useState<UserData[]>([]);
  const [messagesList, setMessagesList] = React.useState<MessageData[]>([]);
  const [successFullyLoadedUsers, setSuccessFullyLoadedUsers] = React.useState(false);
  //const [socket, setSocket] = React.useState<WebSocket | null>(null);

  const categoriesList: SearchResultsItemType[] = [
    { id: 1, name: 'OverWatch' },
    { id: 2, name: 'Fornite' },
    { id: 3, name: 'Modern Warfare 2' },
    { id: 4, name: 'Avatar' }
  ];

  const filterValue = buttonClicked ? 'brightness(100%)' : 'brightness(100%)';

  useEffect(() => {
    if (discoverFilter === MainFiltersEnum.People) {
      const fetchUsers = async () => {
        try {
            const allUsersData = await loadAllUsers();
            const allUsersMap = allUsersData.users.map((user: UserData) => ({id: user.id,email: user.email,username: user.username}));
            setPeoplesList(allUsersMap);
            setSuccessFullyLoadedUsers(true);
        
        } catch (err) {
          Logger('Failed to load all users:'+ err, LogLevel.Error);
        }
      };

      fetchUsers();
    } else {
      setSuccessFullyLoadedUsers(false);
    }
  }, [discoverFilter]);

  useEffect(() => {
 
    const fetchMessages = async () => {
      try {
        Logger(`Loading messages for user: ${userId} and selected user: ${selectedUserId}`, LogLevel.Debug);
        const allUserMessages = await loadUserMessages(userId, selectedUserId);
        
        if (allUserMessages.success && allUserMessages.users) {
          Logger("allUserMessages: " + JSON.stringify(allUserMessages), LogLevel.Debug);
          
          const allUserMessagesMap = allUserMessages.users.map(
            (user: any) => ({
              fromUserId: user.fk_fromuserid,  // Corrected key names
              toUserId: user.fk_touserid,      // Corrected key names
              message: user.textmessage,       // Corrected key names
              timestamp: user.timestamp || new Date().toISOString()
            })
          );
          
          Logger("allUserMessagesMap: " + JSON.stringify(allUserMessagesMap), LogLevel.Debug);
          setMessagesList(allUserMessagesMap);
        } else {
          Logger(`Failed to load messages: ${allUserMessages.error}`, LogLevel.Error);
          setMessagesList([]); // Set empty array on failure
        }
        
      } catch (err) {
        Logger('Failed to load messages: ' + err, LogLevel.Error);
        setMessagesList([]); // Set empty array on error
      }
    };
    
    fetchMessages();
    
  }, [selectedUserId]);

  useEffect(() => {
    if (newMessage && typeof newMessage === 'object') {
      // Add the new message to the existing messages list
      setMessagesList((prevMessages) => [...prevMessages, newMessage]);

      // Optionally, you could dispatch an action to update Redux state
      //dispatch(updateMessagesList(newMessage));
    }
  }, [newMessage, dispatch]);

  const displayPopUpVal = useSelector((state: RootState) => state.displayPopUp.displayPopup);


  
  // Socket logic is now handled by the messaging service


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

// Ref for scrolling
// Ref for scrolling
const messagesEndRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  // Scroll to the bottom when messagesList changes
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messagesList]);

const [message, setMessage] = useState<string>('');

const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
};
const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault(); // Prevents the default form submission behavior

  if (message.trim() && selectedUserId) {
    try {
      // Use MessagingService to send message (saves to DB and sends via socket)
      await messagingService.sendMessage(userId, selectedUserId, message);
      
      Logger(`Message sent from ${userId} to ${selectedUserId}: ${message}`, LogLevel.Info);

      // Format the new message to match your MessageData structure
      const newMessage: MessageData = {
        fromUserId: userId,         // Set the sender ID
        toUserId: selectedUserId,   // Set the receiver ID
        message: message,           // The text message
        timestamp: new Date().toISOString()
      };

      // Append the new message to the current list
      setMessagesList((prevMessages) => [newMessage, ...prevMessages]);

      // Clear the input after sending
      setMessage(""); 

    } catch (err) {
      Logger(`Failed to send message: ${err}`, LogLevel.Error);
      console.error('Failed to send message:', err);
    }
  } else {
    Logger('Cannot send message: missing message content or selected user', LogLevel.Warn);
  }
};
    
    
const style: CSSProperties = { 
  filter: filterValue,
  marginTop: '30px' // Adjust this value based on your needs
};
const messageRef = useRef<HTMLDivElement>(null);

  const cardStyle: CSSProperties = { minHeight: '350px', display: 'flex', flexDirection: 'column' };
  const cardContentStyle: CSSProperties = { flex: '1' };

  return (
    <div className="container">
        <div className="social-window" ref={messageRef}>
            <div className="chat-column left">
                <div className="chat-title">
                  Chats</div>
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
                  {messagesList.map((message, index) => (
                    <div
                      key={index}
                      className={`message-bubble ${
                        message.fromUserId == userId ? 'sent' : 'received'
                      }`}
                    >
                      {message.message}
                    </div>
                  ))}
                  <div ref={messagesEndRef} /> {/* This is used for scrolling to the bottom */}
                </div>
                <form onSubmit={handleSubmit} className="message-input">
                  <input
                      type="text"
                      className="input"
                      placeholder={selectedUser ? `Message ${selectedUser}` : "Select a user to message"}
                      value={message}
                      onChange={handleMessageChange}
                      disabled={!selectedUser}
                  />
                  <button 
                      type="submit" 
                      className="button is-primary"
                      disabled={!selectedUser || !message.trim()}
                  >
                      Send
                  </button>
              </form>
            </div>
        </div>
    </div>
);

}
