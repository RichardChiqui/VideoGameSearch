import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

interface UserState {
  isAuthenticated: boolean;
  userId: number;
  numberOfCurrentFriendRequests: number;
  numberOfCurrentFriends:number;
  socketId: string | null; // Add socketId field
  numOfMessages: number;
  newMessage:string;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: 0,
  numberOfCurrentFriendRequests: 0,
  socketId: null, // Initialize socketId as null
  numberOfCurrentFriends: 0,
  numOfMessages: 0,
  newMessage:""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<{ isAuthenticated: boolean; userId: number; numberOfCurrentFriendRequests: number }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userId = action.payload.userId;
      state.numberOfCurrentFriendRequests = action.payload.numberOfCurrentFriendRequests;
    },
    receiveFriendRequest: (state, action: PayloadAction<number>) => {
      state.numberOfCurrentFriendRequests += action.payload;
    },
    receiveMessage: (state, action: PayloadAction<number>) => {
      state.numOfMessages += action.payload;
    },
    setNewMessage: (state, action: PayloadAction<string>) => {
      state.newMessage += action.payload;
    },
    
    decrementFriendRequest: (state) => {
      state.numberOfCurrentFriendRequests--;
    },
    setSocketId: (state, action: PayloadAction<string>) => { // Define setSocketId action
      state.socketId = action.payload;
    },
    userLoggingOut : (state) =>{
      state.isAuthenticated = false;
    },
    setCurrentNumberOfFriends :(state,action: PayloadAction<number>) =>{
      state.numberOfCurrentFriends = action.payload;
    },
    decrementNumOfFriends :(state) =>{
      state.numberOfCurrentFriends--;
    },
    incrementNumOfFriends :(state) =>{
      state.numberOfCurrentFriends++;
    }
  },
});

export const { userLoggedIn, receiveFriendRequest,receiveMessage,setNewMessage, setSocketId, userLoggingOut,decrementFriendRequest,setCurrentNumberOfFriends,decrementNumOfFriends,incrementNumOfFriends } = userSlice.actions;
export default userSlice.reducer;
