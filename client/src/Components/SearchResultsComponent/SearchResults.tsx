import React, { useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { MainFiltersEnum } from '../../ENUMS';
import { loadAllUsers } from '../../NetworkCalls/FetchCalls/loadAllUsers';
import { userLoggedIn, receiveFriendRequest } from '../../ReduxStore/UserstateSlice';
import { useSocket } from '../../Routes'
import { displayPopUpMethod } from '../../ReduxStore/LoginSlice';
import ChatWindow from '../HomePageComponent/MessageComponent/MessageBubble'; // Import the MessageBubble component

import './searchResultsStyles.css';

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
  const mainFilter = useSelector((state: RootState) => state.mainfilter.value);
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
    if (mainFilter === MainFiltersEnum.People) {
      const fetchUsers = async () => {
        try {
          const usersData = await loadAllUsers();
            const formattedUsers = usersData.users.map((user: UserData) => ({
              id: user.id,
              email: user.email,
              username: user.username
            }));
            console.log("Formatted Users:", formattedUsers);
            setPeoplesList(formattedUsers);
            setSuccessFullyLoadedUsers(true);
        
        } catch (err) {
          console.log('Failed to load users:', err);
        }
      };

      fetchUsers();
    } else {
      setSuccessFullyLoadedUsers(false);
    }
  }, [mainFilter]);


  const displayPopUpVal = useSelector((state: RootState) => state.displayPopUp.displayPopup);


  function handleLinkRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>,recevieverId: number){
    //console.log("attempting to send friend request from:" + userId + " to:" + recevieverId + " and issocket:" + socketLoaded);
  
    if(!userLoggedIn){
      dispatch(displayPopUpMethod(false));
      dispatch(displayPopUpMethod(true));
      return;
    }
 
    if(userLoggedIn){
      console.log("user has been logged in, lets try socketio, what is userid:" + userId + " and socketid:");
      socket?.emit('send-link-request', userId , recevieverId);
    }
  
  }
  React.useEffect(() => {
    if (socket) {
        socket.on("offline-reciever", (data) => {
            console.log("Received friend request, attempting to post now:", data);
          //   const postData: FormData = {
          //     username:data.senderId,
          //     password:data.senderId
  
          // };
  
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
             // setResponseData(data);
            
              if(data.length <= 0){
                 // setFoundAccount(false)
                  console.log("No data received from the server");
              } else{
                 // setFoundAccount(true);
                  const { id,username, password } = data[0]; // Use the updated data object from the response
                  console.log("response data " + username + " and test " + password + " and database id " + id);
                  //dispatch(userLoggedIn({isAuthenticated:true,userId:id,numberOfCurrentFriendRequests : 0}));
       
  
              }
              
          })
          .catch(error => {
              console.error('Error submitting data:', error);
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
