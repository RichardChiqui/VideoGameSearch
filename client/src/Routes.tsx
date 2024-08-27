import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpForm from './Components/SignUpComponent/SignUpForm';
import HomePage from './Components/HomePageComponent/HomePage';
import AccountInfo from './Components/SignUpComponent/AdditionalInfoForm';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from './Store';
import { io, Socket } from "socket.io-client";
import { setSocketId,receiveFriendRequest } from './ReduxStore/UserstateSlice';
import {Logger, LogLevel} from './Logger/Logger'



const SocketContext = React.createContext<Socket | null>(null);
export const useSocket = () => {
    return React.useContext(SocketContext);
  };
function RouterComponent() {

    const isUserLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
    const userId = useSelector((state: RootState) => state.user.userId);
    const [socket, setSocket] = React.useState<Socket | null>(null); // Define socket with type
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (isUserLoggedIn) {
            const newSocket = io('http://localhost:5000'); // Create a new socket
            newSocket.on("connect",() =>{
                Logger("UserId:" + userId + " attempting to connect with socketid:" + newSocket.id,LogLevel.Debug);

                if (newSocket.id) { // Check if newSocket.id is not undefined
                    dispatch(setSocketId(newSocket.id));
                }
                newSocket.emit("user-connected", userId, newSocket.id);
            })
            setSocket(newSocket);
            Logger("UserId:" + userId + " successful",LogLevel.Debug)
        }
    }, [isUserLoggedIn]);

     React.useEffect(() => {
        if (socket) {
            socket.on("receive-friend-request", (data) => {
                Logger("Received friend request:"+ data, LogLevel.Debug);
                dispatch(receiveFriendRequest(1))
                // Dispatch an action or update state to handle the friend request
            });
        }
    }, [socket]);


    return (
        <SocketContext.Provider value={socket}>
               <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/signup" element={<SignUpForm />} />
                        <Route path="/accountinfo" element={<AccountInfo />} />

                    {/* Add more routes as needed */}
                </Routes>
                </BrowserRouter>
            </SocketContext.Provider>
     
        
    );
}

export default RouterComponent;
