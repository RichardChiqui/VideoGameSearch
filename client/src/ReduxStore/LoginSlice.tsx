import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface DisplayPopUp {
  displayPopup : boolean
}

const initialState: DisplayPopUp = {
    displayPopup: false
};

const displayPopSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    displayPopUpMethod: (state, action: PayloadAction<boolean>) => {
      state.displayPopup = action.payload;
    },
  },
});

export const { displayPopUpMethod } = displayPopSlice.actions;
export default displayPopSlice.reducer;
