// loggedInSlice.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LoggedInState {
  value: boolean;
}

const initialState: LoggedInState = {
  value: false,
};

const loggedInSlice = createSlice({
  name: "loggedIn",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { userLoggedIn } = loggedInSlice.actions;
export default loggedInSlice.reducer;
