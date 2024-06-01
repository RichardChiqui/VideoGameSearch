import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

interface UserState {
  isAuthenticated: boolean;
  userId: number;
  socket: Socket | null; // Use Socket.IO connection
  numberOfCurrentFriendRequests: number;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: 0,
  socket: null,
  numberOfCurrentFriendRequests: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<{ isAuthenticated: boolean; userId: number; socket: Socket }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userId = action.payload.userId;
      state.socket = action.payload.socket;
    },
    // setSocket: (state, action: PayloadAction<Socket | null>) => {
    //   state.socket = action.payload;
    // },
    receiveFriendRequest: (state, action: PayloadAction<number>) => {
      state.numberOfCurrentFriendRequests = action.payload;
    },
  },
});

export const { userLoggedIn, receiveFriendRequest } = userSlice.actions;
export default userSlice.reducer;
