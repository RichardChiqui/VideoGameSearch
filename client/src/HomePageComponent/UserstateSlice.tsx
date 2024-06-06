import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  userId: number;
  numberOfCurrentFriendRequests: number;
  socketId: string | null; // Add socketId field
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: 0,
  numberOfCurrentFriendRequests: 0,
  socketId: null, // Initialize socketId as null
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
    setSocketId: (state, action: PayloadAction<string>) => { // Define setSocketId action
      state.socketId = action.payload;
    },
  },
});

export const { userLoggedIn, receiveFriendRequest, setSocketId } = userSlice.actions;
export default userSlice.reducer;
