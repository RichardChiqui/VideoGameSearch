import React, { useEffect, CSSProperties, useState, useRef, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { MainFiltersEnum } from '../../ENUMS';
import { loadAllUsers } from '../../NetworkCalls/FetchCalls/loadAllUsers';
import { userLoggedIn, receiveFriendRequest } from '../../ReduxStore/UserstateSlice';
import { useSocket } from '../../Routes'
import { displayPopUpMethod } from '../../ReduxStore/LoginSlice';
import ChatWindow from '../HomePageComponent/MessageComponent/MessageBubble'; // Import the MessageBubble component
import { loadUserFriends } from '../../NetworkCalls/FetchCalls/loadUserFriends';
import '../../StylingSheets/socialStyles.css';
import { Logger, LogLevel } from '../../Logger/Logger';
import {createNewMessage } from '../../NetworkCalls/createCalls/createNewMessage';
import {loadUserMessages} from '../../NetworkCalls/FetchCalls/loadUserMessages';

export type SearchResultsItemType = {
  id: number;
  name: string;
};

interface UserData {
  id: number;
  username: string;
  email: string;
}

interface messageData {
  fromUserId: number;
  toUserId: number;
  message: string;
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
  const socket = useSocket();
  const numOfFriends = useSelector((state: RootState) => state.user.numberOfCurrentFriends);
  const [userFriends, setUserFriends] = useState<UserFriend[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const handleUserClick = (username: string, userId:number) => {
      setSelectedUser(username);
      setSelectedUserId(userId);
  };
  const [peoplesList, setPeoplesList] = React.useState<UserData[]>([]);
  const [messagesList, setMessagesList] = React.useState<messageData[]>([]);
  const [successFullyLoadedUsers, setSuccessFullyLoadedUsers] = React.useState(false);
  //const [socket, setSocket] = React.useState<WebSocket | null>(null);

  const categoriesList: SearchResultsItemType[] = [
    { id: 1, name: 'OverWatch' },
    { id: 2, name: 'Fornite' },
    { id: 3, name: 'Modern Warfare 2' },
    { id: 4, name: 'Avatar' }
  ];

  const filterValue = buttonClicked ? 'brightness(50%)' : 'brightness(100%)';

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
        console.log("loading messages for user: " + userId + " and selected user: " + selectedUserId);
        const allUserMessages = await loadUserMessages(userId, selectedUserId);
        Logger("allUserMessages: " + JSON.stringify(allUserMessages), LogLevel.Debug);
        
        const allUserMessagesMap = allUserMessages.users.map(
          (user: any) => ({
            fromUserId: user.fk_fromuserid,  // Corrected key names
            toUserId: user.fk_touserid,      // Corrected key names
            message: user.textmessage        // Corrected key names
          })
        );
        
        Logger("allUserMessagesMap: " + JSON.stringify(allUserMessagesMap), LogLevel.Debug);
        setMessagesList(allUserMessagesMap);
        
      } catch (err) {
        Logger('Failed to load all users: ' + err, LogLevel.Error);
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


  
  React.useEffect(() => {
    if (socket) {
        socket.on("offline-reciever", (data) => {
          Logger("Received friend request, attempting to post now:"+ data.senderId + " to " + data.recevieverId, LogLevel.Debug);
          
          fetch('http://localhost:5000/friend_request', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({senderId: data.senderId, receiverId : data.recevieverId})
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Failed to submit data');
              }
              return response.json();
          })
          .then(data => {
                const { id,username, password } = data[0]; 
                console.log("response data " + username + " and test " + password + " and database id " + id);
                  
  
              
          })
          .catch(error => {
             Logger('Error submitting data:'+ error, LogLevel.Error);
          });
            // Dispatch an action or update state to handle the friend request
        });
    }
}, [socket]);


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
    
      if (message.trim()) {
        try {
          // Call your function to handle sending the message
          const messageData = await createNewMessage(userId, selectedUserId, message);
          Logger("Message data: " + JSON.stringify(messageData), LogLevel.Debug);
    
          // Format the new message to match your messageData structure
          const newMessage: messageData = {
            fromUserId: userId,         // Set the sender ID
            toUserId: selectedUserId,   // Set the receiver ID
            message: message,           // The text message
          };
    
          // Append the new message to the current list
          setMessagesList((prevMessages) => [newMessage,...prevMessages ]);
    
          // Clear the input after sending
          setMessage(""); 
    
        } catch (err) {
          console.error('Failed to send message:', err);
        }
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
                      placeholder={`Message ${selectedUser}`}
                      value={message}
                      onChange={handleMessageChange}
                  />
                  <button type="submit" className="button is-primary">
                      Send
                  </button>
              </form>
            </div>
        </div>
    </div>
);

}
