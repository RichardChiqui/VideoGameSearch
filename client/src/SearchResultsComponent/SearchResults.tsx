import React, { useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store';
import { MainFiltersEnum } from '../ENUMS';
import { loadUsers } from '../FetchCalls/loadUsers';
import { userLoggedIn, receiveFriendRequest } from '../HomePageComponent/UserstateSlice';
import { useSocket } from '../Routes'

import './searchResultsStyles.css';

export type SearchResultsItemType = {
  id: number;
  name: string;
};

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface SearchResultsProps {
  buttonClicked: boolean;
}

export default function SearchResults({ buttonClicked }: SearchResultsProps) {
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
          const usersData = await loadUsers();
          if (usersData.users.length > 0) {
            const formattedUsers = usersData.users.map((user: UserData) => ({
              id: user.id,
              email: user.email,
              name: user.name
            }));
            setPeoplesList(formattedUsers);
            setSuccessFullyLoadedUsers(true);
          }
        } catch (err) {
          console.log('Failed to load users:', err);
        }
      };

      fetchUsers();
    } else {
      setSuccessFullyLoadedUsers(false);
    }
  }, [mainFilter]);



  function handleLinkRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>,recevieverId: number){
    //console.log("attempting to send friend request from:" + userId + " to:" + recevieverId + " and issocket:" + socketLoaded);
    console.log("attmepting to use socket.io:" + userLoggedIn);
    if(userLoggedIn){
      console.log("user has been logged in, lets try socketio, what is userid:" + userId + " and socketid:");
      socket?.emit('send-link-request', userId , recevieverId);
      console.log("completed with socketio")
      
    }


    // if (socketLoaded) {
    //   console.log("ok so strange");
    //   // Example: Send a JSON object representing the friend request
    //   const friendRequestData = {
    //     type:"friend_request",
    //     senderId: userId, // Replace with the sender's ID
    //     recipientId: recevieverId // Use the provided userId
    //   };

    //   // Convert the friend request data to a string and send it over the WebSocket connection
    //   socketLoaded.send(JSON.stringify(friendRequestData));
    // }
  }

  const style: CSSProperties = { filter: filterValue };
  const cardStyle: CSSProperties = { minHeight: '350px', display: 'flex', flexDirection: 'column' };
  const cardContentStyle: CSSProperties = { flex: '1' };

  return (
    <div className="container" style={style}>
      <div className="columns is-multiline">
        {successFullyLoadedUsers
          ? peoplesList.map((item: UserData) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title">{item.name}</p>
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      <p>Email: {item.email}</p>
                    </div>
                  </div>
                  <footer className="card-footer">
                    <button className="button card-footer-item" onClick={(event) => handleLinkRequest(event, item.id)}>Send Link Request</button>
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
  );
}
