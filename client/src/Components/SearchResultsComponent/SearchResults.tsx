import React, { useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { MainFiltersEnum } from '../../ENUMS';
import { loadAllUsers } from '../../NetworkCalls/FetchCalls/loadAllUsers';
import { userLoggedIn, receiveFriendRequest } from '../../ReduxStore/UserstateSlice';
import { useSocket } from '../../Routes'
import { displayPopUpMethod } from '../../ReduxStore/LoginSlice';
import ChatWindow from '../HomePageComponent/MessageComponent/MessageBubble'; // Import the MessageBubble component
import MessageComposeModal from './MessageComposeModal';

import '../../StylingSheets/searchResultsStyles.css';
import { Logger, LogLevel } from '../../Logger/Logger';

export type SearchResultsItemType = {
  id: number;
  name: string;
};

interface UserData {
  id: number;
  username: string;
  email: string;
  playStyles?: string[];
  skillLevel?: string;
  game?: string;
}

interface SearchResultsProps {
  onButtonClick: () => void;
  buttonClicked: boolean;
}

export default function SearchResults({ onButtonClick, buttonClicked }: SearchResultsProps) {
  const discoverFilter = useSelector((state: RootState) => state.mainfilter.discoverSubFilter);
  const userId = useSelector((state: RootState) => state.user.userId);
  const userLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const socket = useSocket();

  const [peoplesList, setPeoplesList] = React.useState<UserData[]>([]);
  const [successFullyLoadedUsers, setSuccessFullyLoadedUsers] = React.useState(false);
  const [sentRequests, setSentRequests] = React.useState<Set<number>>(new Set());
  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserData | null>(null);
  const messageBubbleRef = React.useRef<{
    addNewUser: (user: { id: number; username: string }) => void;
    addNewMessage: (message: { fromUserId: number; toUserId: number; message: string; timestamp: string }) => void;
  }>(null);
  //const [socket, setSocket] = React.useState<WebSocket | null>(null);

  const categoriesList: SearchResultsItemType[] = [
    { id: 1, name: 'OverWatch' },
    { id: 2, name: 'Fornite' },
    { id: 3, name: 'Modern Warfare 2' },
    { id: 4, name: 'Avatar' }
  ];

  // Sample data with play styles and skills for demonstration
  const sampleUsersWithData: UserData[] = [
    { id: 1, username: 'GamerPro123', email: 'pro@email.com', playStyles: ['Competitive', 'Ranked'], skillLevel: 'Expert', game: 'Overwatch' },
    { id: 2, username: 'CasualPlayer', email: 'casual@email.com', playStyles: ['Casual', 'Quick Play'], skillLevel: 'Intermediate', game: 'Fortnite' },
    { id: 3, username: 'RPGMaster', email: 'rpg@email.com', playStyles: ['Role-Playing', 'Story Mode'], skillLevel: 'Advanced', game: 'Modern Warfare 2' },
    { id: 4, username: 'NewbieGamer', email: 'new@email.com', playStyles: ['Casual'], skillLevel: 'Beginner', game: 'Avatar' }
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


  const displayPopUpVal = useSelector((state: RootState) => state.displayPopUp.displayPopup);


  function handleLinkRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, user: UserData){
    if(!userLoggedIn){
      dispatch(displayPopUpMethod(false));
      dispatch(displayPopUpMethod(true));
      return;
    }
 
    if(userLoggedIn){
      // Set selected user and open modal
      setSelectedUser(user);
      setIsMessageModalOpen(true);
    }
  }

  function handleSendMessage(message: string) {
    if (!selectedUser) return;

    Logger('user has been logged in, lets try socketio, what is userid:' + userId + ' and socketid:', LogLevel.Debug);
   
    // Send friend request
    socket?.emit('send-link-request', userId, selectedUser.id);
    
    // Send the custom message via socket
    socket?.emit('send-message', {
      fromUserId: userId,
      toUserId: selectedUser.id,
      message: message,
      timestamp: new Date().toISOString()
    });
    
    // Add user to chat bubble friends list
    if (messageBubbleRef.current) {
      messageBubbleRef.current.addNewUser({
        id: selectedUser.id,
        username: selectedUser.username
      });
      
      // Add message to chat bubble
      messageBubbleRef.current.addNewMessage({
        fromUserId: userId,
        toUserId: selectedUser.id,
        message: message,
        timestamp: new Date().toISOString()
      });
    }
    
    // Show success feedback
    setSentRequests(prev => new Set(Array.from(prev).concat(selectedUser.id)));
    Logger('Friend request and gaming message sent successfully!', LogLevel.Info);
    
    // Reset button state after 3 seconds
    setTimeout(() => {
      setSentRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedUser.id);
        return newSet;
      });
    }, 3000);
  }

  function handleCloseModal() {
    setIsMessageModalOpen(false);
    setSelectedUser(null);
  }
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

const style: CSSProperties = { 
  filter: filterValue,
  marginTop: '30px' // Adjust this value based on your needs
};

  const cardStyle: CSSProperties = { minHeight: '350px', display: 'flex', flexDirection: 'column' };
  const cardContentStyle: CSSProperties = { flex: '1' };

  return (
    <>

    <div className="container" style={style}>
  
      <div className="columns is-multiline">
        {successFullyLoadedUsers
          ? sampleUsersWithData.map((item: UserData) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title">{item.username}</p>
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      {/* Game Information */}
                      {item.game && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Game:</strong> {item.game}
                        </div>
                      )}
                      
                      {/* Horizontal line separator */}
                      <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                      
                      {/* Play Style Tags */}
                      {item.playStyles && item.playStyles.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Play Style:</strong>
                          <div style={{ marginTop: '5px' }}>
                            {item.playStyles.map((style, index) => (
                              <span 
                                key={index}
                                className="tag is-info is-light" 
                                style={{ marginRight: '5px', marginBottom: '3px', fontSize: '0.75rem' }}
                              >
                                {style}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Horizontal line separator */}
                      <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                      
                      {/* Skill Level */}
                      {item.skillLevel && (
                        <div>
                          <strong>Skill Level:</strong>
                          <span 
                            className={`tag ${
                              item.skillLevel === 'Expert' ? 'is-danger' :
                              item.skillLevel === 'Advanced' ? 'is-warning' :
                              item.skillLevel === 'Intermediate' ? 'is-info' :
                              'is-light'
                            }`}
                            style={{ marginLeft: '5px', fontSize: '0.75rem' }}
                          >
                            {item.skillLevel}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <footer className="card-footer">
                   {userLoggedIn? (
                     <button 
                       className={`button card-footer-item ${sentRequests.has(item.id) ? 'is-success' : 'is-primary'}`}
                       onClick={(event) => handleLinkRequest(event, item)}
                       disabled={sentRequests.has(item.id)}
                     >
                       {sentRequests.has(item.id) ? '✓ Request Sent!' : 'Send Link Request'}
                     </button>
                   ) : (
                     <button className="button card-footer-item" onClick={onButtonClick}>Send Link Request</button>
                   )}
                    {/* <button className="button card-footer-item">Profile</button> */}
                  </footer>
                </div>
              </div>
            ))
          : categoriesList.map((item: SearchResultsItemType) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title">{item.name}</p>
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      <p>Game: {item.name}</p>
                    </div>
                  </div>
                  <footer className="card-footer">
                    <button className="button card-footer-item">Send Link Request</button>
                    <button className="button card-footer-item">Profile</button>
                  </footer>
                </div>
              </div>
            ))}
      </div>
    
    </div>
     {userLoggedIn && <ChatWindow ref={messageBubbleRef} />} 
     
     {/* Message Compose Modal */}
     <MessageComposeModal
       isOpen={isMessageModalOpen}
       onClose={handleCloseModal}
       onSend={handleSendMessage}
       recipientName={selectedUser?.username || ''}
       gameName={selectedUser?.game}
     />
    </>
  );
}
