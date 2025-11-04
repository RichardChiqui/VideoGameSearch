import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LinkRequestNotification {
    id: number;
    game_name: string;
    platform?: string;
    createdAt: string;
}

interface Notifications{
    value: number;
    linkRequestNotifications: LinkRequestNotification[];
}

const initialState: Notifications = {
    value: 0,
    linkRequestNotifications: []
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
        },
        addLinkRequestNotification: (state, action: PayloadAction<LinkRequestNotification>) => {
            state.linkRequestNotifications.unshift(action.payload);
        },
        removeLinkRequestNotification: (state, action: PayloadAction<number>) => {
            state.linkRequestNotifications = state.linkRequestNotifications.filter(
                notif => notif.id !== action.payload
            );
        },
        clearLinkRequestNotifications: (state) => {
            state.linkRequestNotifications = [];
        }
    }
})

export const { 
    addNotification, 
    removeNotification, 
    setNumberOfNotifications,
    addLinkRequestNotification,
    removeLinkRequestNotification,
    clearLinkRequestNotifications
} = notificationsSlice.actions;
export default notificationsSlice.reducer;