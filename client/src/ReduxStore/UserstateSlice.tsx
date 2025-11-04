import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { REGIONS_ENUMS } from "../enums/RegionsEnums";

interface UserState {
  isAuthenticated: boolean;
  userId: number;
  userEmail: string;
  display_name: string;
  numberOfCurrentFriendRequests: number;
  numberOfCurrentFriends:number;
  socketId: string | null; // Add socketId field
  numOfMessages: number;
  newMessage:string;
  region: REGIONS_ENUMS | undefined;
  profile_description?: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: 0,
  userEmail: '',
  display_name: '',
  numberOfCurrentFriendRequests: 0,
  socketId: null, // Initialize socketId as null
  numberOfCurrentFriends: 0,
  numOfMessages: 0,
  newMessage:"",
  region: undefined,
  profile_description: ''
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Authentication actions
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserData: (state, action: PayloadAction<{ userId: number; userEmail: string; display_name: string
      region: REGIONS_ENUMS;
      profile_description: string;
     }>) => {
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
      state.display_name = action.payload.display_name;
      state.region = action.payload.region;
      state.profile_description = action.payload.profile_description;
    },
    // Legacy action for backward compatibility (can be removed later)
    userLoggedIn: (state, action: PayloadAction<{ isAuthenticated: boolean; userId: number; username: string; numberOfCurrentFriendRequests: number }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userId = action.payload.userId;
      state.numberOfCurrentFriendRequests = action.payload.numberOfCurrentFriendRequests;
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.userEmail = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.display_name = action.payload;
    },
    userLoggedOut: (state) => {
      state.isAuthenticated = false;
      state.userId = 0;
      state.userEmail = '';
      state.display_name = '';
      state.numberOfCurrentFriendRequests = 0;
      state.numberOfCurrentFriends = 0;
      state.numOfMessages = 0;
      state.newMessage = '';
      state.socketId = null;
      state.region = undefined;
      state.profile_description = '';
    },
    // Friend request actions
    setFriendRequestCount: (state, action: PayloadAction<number>) => {
      state.numberOfCurrentFriendRequests = action.payload;
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
      state.userId = 0;
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

export const { 
  // New focused actions
  setAuthenticated, 
  setUserData, 
  setFriendRequestCount,
  // Legacy actions (for backward compatibility)
  userLoggedIn, 
  userLoggedOut, 
  setUserId, 
  setUserEmail, 
  setUserName, 
  receiveFriendRequest,
  receiveMessage,
  setNewMessage, 
  setSocketId, 
  userLoggingOut,
  decrementFriendRequest,
  setCurrentNumberOfFriends,
  decrementNumOfFriends,
  incrementNumOfFriends 
} = userSlice.actions;
export default userSlice.reducer;
