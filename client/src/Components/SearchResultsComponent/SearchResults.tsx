import React, { useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { MainFiltersEnum } from '../../ENUMS';
import { loadAllUsers } from '../../NetworkCalls/FetchCalls/loadAllUsers';
import { userLoggedIn, receiveFriendRequest } from '../../ReduxStore/UserstateSlice';
import { useSocket } from '../../hooks/useSocket'
import { useMessaging } from '../../hooks/useMessaging'
import { displayPopUpMethod } from '../../ReduxStore/LoginSlice';
import ChatWindow from '../HomePageComponent/MessageComponent/MessageBubble'; // Import the MessageBubble component
import MessageComposeModal from './MessageComposeModal';
import LinkRequestModal from './LinkRequestModal';

import '../../StylingSheets/searchResultsStyles.css';
import { Logger, LogLevel } from '../../Logger/Logger';
import { loadLinkRequests } from '../../NetworkCalls/FetchCalls/LinkRequests/FetchLinkRequests';
import { LinkRequest, SkillLevel } from '../../models/LinkRequest';
import { ChatHistoryRecepient } from '../../models/ChatHistoryRecepient';
import { Message } from '../../models/Message'

export type SearchResultsItemType = {
  id: number;
  name: string;
};

interface UserData {
  id: number;
  username: string;
  email?: string;
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
  const user = useSelector((state: RootState) => state.user);
  const userLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const { sendGameInvitation } = useMessaging();

  const [linkRequestsList, setLinkRequestsList] = React.useState<LinkRequest[]>([]);
  const [successFullyLoadedUsers, setSuccessFullyLoadedUsers] = React.useState(true);
  const [sentRequests, setSentRequests] = React.useState<Set<number>>(new Set());
  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
  const [isLinkRequestModalOpen, setIsLinkRequestModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserData | null>(null);
  const messageBubbleRef = React.useRef<{
    addNewUser: (user: ChatHistoryRecepient) => void;
    addNewMessage: (message: Message) => void;
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

  const filterValue = buttonClicked ? 'brightness(100%)' : 'brightness(100%)';

  useEffect(() => {
   // if (discoverFilter === MainFiltersEnum.People) {
      const fetchUsers = async () => {
        try {
          const linkRequestsData = await loadLinkRequests();
          const linkRequestsList : LinkRequest[] = linkRequestsData.linkRequests.map((req: LinkRequest) => ({
            id: req.id,
            user_id: req.user_id,
            display_name: req.display_name,
            game_name: req.game_name,
            tags: req.tags,
            skill_level: req.skill_level,
          }));
        
          setLinkRequestsList(linkRequestsList);
          setSuccessFullyLoadedUsers(true);
        } catch (err) {
          Logger('Failed to load all link requests:'+ err, LogLevel.Error);
        }
      };
      fetchUsers();
  }, [userLoggedIn, userId]);


  const displayPopUpVal = useSelector((state: RootState) => state.displayPopUp.displayPopup);


  function handleLinkRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, linkRequest: LinkRequest){
    if(!userLoggedIn){
      dispatch(displayPopUpMethod(false));
      dispatch(displayPopUpMethod(true));
      return;
    }
 
    if(userLoggedIn){
      // Convert LinkRequest to UserData format and set as selected user
      const userData: UserData = {
        id: linkRequest.user_id,
        username: linkRequest.display_name,
        playStyles: linkRequest.tags,
        skillLevel: linkRequest.skill_level,
        game: linkRequest.game_name
      };
      
      setSelectedUser(userData);
      setIsMessageModalOpen(true);
    }
  }

  async function handleSendMessage(message: string) {
    if (!selectedUser) return;

    Logger(`Sending game invitation from ${userId} to ${selectedUser.id}`, LogLevel.Debug);
   
    try {
      // Send both friend request and message using the clean service
      await sendGameInvitation(userId, selectedUser.id, message);
      
      // Add user to chat bubble friends list
      if (messageBubbleRef.current) {
        Logger(`Adding user ${selectedUser.username} to chat bubble`, LogLevel.Debug);
        messageBubbleRef.current.addNewUser({
          fk_touserid: selectedUser.id,
          todisplayname: selectedUser.username
        });
        
        // Add message to chat bubble
        Logger(`Adding message to chat bubble: ${message}`, LogLevel.Debug);
        messageBubbleRef.current.addNewMessage({
          id: selectedUser.id,
          fromUserId: userId,
          toUserId: selectedUser.id,
          message: message,
          timestamp: new Date().toISOString()
        });
      } else {
        Logger('MessageBubble ref is null - cannot add user or message', LogLevel.Warn);
      }
      
      // Show success feedback
      setSentRequests(prev => new Set(Array.from(prev).concat(selectedUser.id)));
      Logger('Game invitation sent successfully!', LogLevel.Info);
      
      // Reset button state after 3 seconds
      setTimeout(() => {
        setSentRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedUser.id);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      Logger(`Error sending game invitation: ${error}`, LogLevel.Error);
      // You might want to show an error message to the user here
    }
  }

  function handleCloseModal() {
    setIsMessageModalOpen(false);
    setSelectedUser(null);
  }

  function handleOpenLinkRequestModal() {
    setIsLinkRequestModalOpen(true);
  }

  function handleCloseLinkRequestModal() {
    setIsLinkRequestModalOpen(false);
  }

  function handleLinkRequestSuccess() {
    Logger('Link request created successfully', LogLevel.Info);
    // You can add additional success handling here
    // For example, refresh the users list or show a success message
  }
  // Socket logic is now handled by the messaging service

const style: CSSProperties = { 
  filter: filterValue,
  marginTop: '30px' // Adjust this value based on your needs
};

  const cardStyle: CSSProperties = { minHeight: '350px', display: 'flex', flexDirection: 'column' };
  const cardContentStyle: CSSProperties = { flex: '1' };

  return (
    <>

    <div className="container" style={style}>
      {/* Create Link Request Button */}
      {userLoggedIn && (
        <div className="has-text-centered" style={{ marginBottom: '30px' }}>
          <button 
            className="button is-primary is-large"
            onClick={handleOpenLinkRequestModal}
            style={{
              background: 'linear-gradient(135deg, #6B73FF 0%, #9B59B6 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 30px',
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              boxShadow: '0 4px 15px rgba(107, 115, 255, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 115, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 115, 255, 0.3)';
            }}
          >
            🎮 Create Link Request
          </button>
        </div>
      )}
  
      <div className="columns is-multiline">
        {successFullyLoadedUsers
          ? linkRequestsList.map((item: LinkRequest) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title">{item.display_name}</p>
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      {/* Game Information */}
                      {item.game_name && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Game:</strong> {item.game_name}
                        </div>
                      )}
                      
                      {/* Horizontal line separator */}
                      <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                      
                      {/* Play Style Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Play Style:</strong>
                          <div style={{ marginTop: '5px' }}>
                            {item.tags.map((style, index) => (
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
                      {item.skill_level && (
                        <div>
                          <strong>Skill Level:</strong>
                          <span 
                            className={`tag ${
                              item.skill_level === SkillLevel.EXPERT ? 'is-danger' :
                              item.skill_level === SkillLevel.ADVANCED ? 'is-warning' :
                              item.skill_level === SkillLevel.INTERMEDIATE ? 'is-info' :
                              'is-light'
                            }`}
                            style={{ marginLeft: '5px', fontSize: '0.75rem' }}
                          >
                              {item.skill_level}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <footer className="card-footer">
                   {userLoggedIn? (
                     <button 
                       className={`button card-footer-item ${sentRequests.has(item.user_id) ? 'is-success' : 'is-primary'}`}
                       onClick={(event) => handleLinkRequest(event, item)}
                       disabled={sentRequests.has(item.user_id)}
                     >
                       {sentRequests.has(item.user_id) ? '✓ Request Sent!' : 'Send Link Request'}
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

     {/* Link Request Modal */}
     <LinkRequestModal
       isOpen={isLinkRequestModalOpen}
       onClose={handleCloseLinkRequestModal}
       onSuccess={handleLinkRequestSuccess}
     />
    </>
  );
}
