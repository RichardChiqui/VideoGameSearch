// loggedInSlice.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

interface UserState {
  isAuthenticated: boolean;
  userId: number;
  socket: WebSocket | null; // Add WebSocket connection
  numberOfCurrentFriendRequests: number;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: 0,
  socket: null,
  numberOfCurrentFriendRequests:0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<UserState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userId = action.payload.userId;
      state.socket = action.payload.socket;
    },
    setSocket: (state, action: PayloadAction<WebSocket>) => {
      state.socket = action.payload;
    },
    receiveFriendRequest: (state, action: PayloadAction<number>) => {
      state.numberOfCurrentFriendRequests = action.payload;
    },
  },
});


export const { userLoggedIn, setSocket,receiveFriendRequest } = userSlice.actions;
export default userSlice.reducer;
