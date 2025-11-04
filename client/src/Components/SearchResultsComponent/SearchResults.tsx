import React, { useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { displayPopUpMethod } from '../../ReduxStore/LoginSlice';
import ChatWindow from '../HomePageComponent/MessageComponent/MessageBubble';
import MessageComposeModal from './MessageComposeModal';
import LinkRequestModal from './LinkRequestModal';
import { loadLinkRequests, loadLinkRequestsByGame } from '../../NetworkCalls/FetchCalls/LinkRequests/FetchLinkRequests';
import { LinkRequest } from '../../models/LinkRequest';
import { REGIONS_DESCRIPTIONS, REGIONS_ENUMS } from '../../enums/RegionsEnums';
import { useMessaging } from '../../hooks/useMessaging';

import '../../StylingSheets/searchResultsStyles.css';
import { Logger, LogLevel } from '../../Logger/Logger';
import { ChatHistoryRecepient } from '../../models/ChatHistoryRecepient';
import { Message } from '../../models/Message';

interface UserData {
  id: number;
  username: string;
  email?: string;
  playStyles?: string[];
  description?: string;
  game?: string;
}

interface SearchResultsProps {
  onButtonClick: () => void;
  buttonClicked: boolean;
  searchFilters?: any;
}

export default function SearchResults({ onButtonClick, buttonClicked, searchFilters }: SearchResultsProps) {
  const userId = useSelector((state: RootState) => state.user.userId);
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

  const filterValue = buttonClicked ? 'brightness(100%)' : 'brightness(100%)';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let linkRequestsData;
        
        // If search filters are provided and contain a game, filter by game
        if (searchFilters && searchFilters.game) {
          Logger(`Filtering link requests by game: ${searchFilters.game}`, LogLevel.Info);
          linkRequestsData = await loadLinkRequestsByGame(searchFilters.game);
        } else {
          // Load all link requests if no game filter
          linkRequestsData = await loadLinkRequests();
        }
        
        const allLinkRequests: LinkRequest[] = linkRequestsData.linkRequests.map((req: LinkRequest) => {
          // Convert region enum ID to description if it exists
          let regionDescription: string | undefined = req.region;
          if (req.region && typeof req.region === 'number') {
            const enumValue = req.region as REGIONS_ENUMS;
            regionDescription = REGIONS_DESCRIPTIONS[enumValue] || String(req.region);
          } else if (!req.region) {
            regionDescription = undefined;
          }
          
          return {
            id: req.id,
            user_id: req.user_id,
            display_name: req.display_name,
            game_name: req.game_name,
            tags: req.tags,
            description: req.description || '',
            status: req.status,
            region: regionDescription,
            platform: req.platform
          };
        });
        
        // Filter out the current user's own requests - only show other users' requests
        const otherUsersRequests = allLinkRequests.filter(req => req.user_id !== userId);
        
        setLinkRequestsList(otherUsersRequests);
        setSuccessFullyLoadedUsers(true);
      } catch (err) {
        Logger('Failed to load all link requests:'+ err, LogLevel.Error);
      }
    };
    fetchUsers();
  }, [searchFilters, userId]);


  const displayPopUpVal = useSelector((state: RootState) => state.displayPopUp.displayPopup);


  function handleOpenLinkRequestModal() {
    Logger(`handleOpenLinkRequestModal called - userLoggedIn: ${userLoggedIn}`, LogLevel.Debug);
    
    if (!userLoggedIn) {
      // Redirect to login for unauthenticated users
      Logger('User not authenticated, triggering login popup', LogLevel.Debug);
      dispatch(displayPopUpMethod(false));
      dispatch(displayPopUpMethod(true));
      return;
    }
    
    // Open modal for authenticated users
    Logger('User authenticated, opening link request modal', LogLevel.Debug);
    setIsLinkRequestModalOpen(true);
  }

  function handleCloseLinkRequestModal() {
    setIsLinkRequestModalOpen(false);
  }

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
        description: linkRequest.description,
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
    }
  }

  function handleCloseModal() {
    setIsMessageModalOpen(false);
    setSelectedUser(null);
  }

  function handleLinkRequestSuccess() {
    Logger('Link request created successfully', LogLevel.Info);
    // Refresh the link requests list to show the new request
    const fetchUsers = async () => {
      try {
        let linkRequestsData;
        
        // If search filters are provided and contain a game, filter by game
        if (searchFilters && searchFilters.game) {
          Logger(`Refreshing link requests by game: ${searchFilters.game}`, LogLevel.Info);
          linkRequestsData = await loadLinkRequestsByGame(searchFilters.game);
        } else {
          // Load all link requests if no game filter
          linkRequestsData = await loadLinkRequests();
        }
        
        const allLinkRequests: LinkRequest[] = linkRequestsData.linkRequests.map((req: LinkRequest) => {
          // Convert region enum ID to description if it exists
          let regionDescription: string | undefined = req.region;
          if (req.region && typeof req.region === 'number') {
            const enumValue = req.region as REGIONS_ENUMS;
            regionDescription = REGIONS_DESCRIPTIONS[enumValue] || String(req.region);
          } else if (!req.region) {
            regionDescription = undefined;
          }
          
          return {
            id: req.id,
            user_id: req.user_id,
            display_name: req.display_name,
            game_name: req.game_name,
            tags: req.tags,
            description: req.description || '',
            status: req.status,
            region: regionDescription,
            platform: req.platform
          };
        });
        
        // Filter out the current user's own requests - only show other users' requests
        const otherUsersRequests = allLinkRequests.filter(req => req.user_id !== userId);
        
        setLinkRequestsList(otherUsersRequests);
        setSuccessFullyLoadedUsers(true);
      } catch (err) {
        Logger('Failed to load all link requests:'+ err, LogLevel.Error);
      }
    };
    fetchUsers();
  }
  // Socket logic is now handled by the messaging service

  const style: CSSProperties = { 
    filter: filterValue,
    marginTop: '30px' // Adjust this value based on your needs
  };

  const cardStyle: CSSProperties = { minHeight: '280px', display: 'flex', flexDirection: 'column' };
  const cardContentStyle: CSSProperties = { flex: '1' };

  return (
    <>
      {/* Show active filter info */}
      {/* {searchFilters && searchFilters.game && (
        <div className="active-filter-info" style={{
          padding: '10px 15px',
          backgroundColor: '#e8f4f8',
          border: '1px solid #6B73FF',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: '0 20px 20px 20px'
        }}>
          <i className="fas fa-filter" style={{ color: '#6B73FF' }}></i>
          <span style={{ color: '#2c3e50', fontWeight: '500' }}>
            Showing link requests for: <strong>{searchFilters.game}</strong>
          </span>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: 'none',
              border: 'none',
              color: '#6B73FF',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            Clear filter
          </button>
        </div>
      )} */}

    <div className="container" style={style}>
      {/* Create Link Request Button */}
      <div className="has-text-centered" style={{ marginBottom: '30px' }}>
        <button 
          className="button is-primary is-large create-link-request-btn"
          onClick={handleOpenLinkRequestModal}
        >
           Create Link Request
        </button>
      </div>
  
      <div className="columns is-multiline">
        {successFullyLoadedUsers
          ? linkRequestsList.map((item: LinkRequest) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title" style={{ margin: 0, flex: 1, userSelect: 'none', cursor: 'default' }}>{item.display_name}</p>
                    {item.region && (
                      <span className="card-header-region" style={{ 
                        color: 'white', 
                        fontSize: '0.75em', 
                        opacity: 0.9,
                        fontWeight: 'bold',
                        userSelect: 'none',
                        cursor: 'default'
                      }}>
                        {item.region}
                      </span>
                    )}
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      {/* Game and Platform Information */}
                      {(item.game_name || item.platform) && (
                        <div style={{ marginBottom: '8px', userSelect: 'none', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {item.game_name && (
                            <span style={{ fontSize: '0.75em' }}>
                              <strong>Game:</strong> {item.game_name}
                            </span>
                          )}
                          {item.platform && (
                            <span style={{ fontSize: '0.75em' }}>
                              <strong>Platform:</strong> {item.platform}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Horizontal line separator */}
                      <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                      
                      {/* Play Style Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ marginBottom: '8px', userSelect: 'none', cursor: 'default' }}>
                          <strong>Play Style:</strong>
                          <div style={{ marginTop: '4px' }}>
                            {item.tags.map((style, index) => (
                              <span 
                                key={index}
                                className="tag is-info is-light" 
                                style={{ marginRight: '4px', marginBottom: '2px', fontSize: '0.7rem', userSelect: 'none', cursor: 'default' }}
                              >
                                {style}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Horizontal line separator */}
                      <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                      
                      {/* Description */}
                      {item.description && (
                        <div style={{ marginBottom: '8px', userSelect: 'none', cursor: 'default' }}>
                          <strong>Description:</strong>
                          <p style={{ marginTop: '4px', marginBottom: '0', fontSize: '0.8em', color: '#2C3E50', lineHeight: '1.3' }}>
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <footer className="card-footer">
                   {userLoggedIn ? (
                     // Show send request button for other users' requests
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
                  </footer>
                </div>
              </div>
            ))
          : (
            <div className="has-text-centered" style={{ padding: '60px 20px', width: '100%' }}>
              <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>Loading link requests...</p>
            </div>
          )}
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
