import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Notifications{
    value:number;
}

const initialState: Notifications = {
    value:0
}

const notificationsSlice = createSlice({
    name:"notifications",
    initialState,
    reducers:{
        addNotification :(state, action: PayloadAction<number>) =>{
            state.value = action.payload;

        },
        removeNotification :(state, action: PayloadAction<number>) =>{
            state.value = action.payload;
        },
        setNumberOfNotifications :(state, action: PayloadAction<number>) =>{
            state.value = action.payload;
        }
        
    }
})


export const { addNotification,removeNotification,setNumberOfNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;