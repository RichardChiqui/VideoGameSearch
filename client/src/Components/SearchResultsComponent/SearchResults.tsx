import React, { useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { MainFiltersEnum } from '../../ENUMS';
import { loadAllUsers } from '../../NetworkCalls/FetchCalls/loadAllUsers';
import { userLoggedIn, receiveFriendRequest } from '../../ReduxStore/UserstateSlice';
import { useSocket } from '../../Routes'
import { displayPopUpMethod } from '../../ReduxStore/LoginSlice';
import ChatWindow from '../HomePageComponent/MessageComponent/MessageBubble'; // Import the MessageBubble component

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


  const displayPopUpVal = useSelector((state: RootState) => state.displayPopUp.displayPopup);


  function handleLinkRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>,recevieverId: number){
    if(!userLoggedIn){
      dispatch(displayPopUpMethod(false));
      dispatch(displayPopUpMethod(true));
      return;
    }
 
    if(userLoggedIn){
      Logger('user has been logged in, lets try socketio, what is userid:' + userId + ' and socketid:', LogLevel.Debug);
     
    
      socket?.emit('send-link-request', userId , recevieverId);
    }
  
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
          ? peoplesList.map((item: UserData) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title">{item.username}</p>
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      {/* <p>Email: {item.email}</p> */}
                    </div>
                  </div>
                  <footer className="card-footer">
                   {userLoggedIn? <button className="button card-footer-item" onClick={(event) => handleLinkRequest(event, item.id)}>Send Link Request</button> : 
                   <button className="button card-footer-item" onClick={onButtonClick}>Send Link Request</button> }
                    <button className="button card-footer-item">Profile</button>
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
     {userLoggedIn && <ChatWindow />} 
    </>
  );
}
