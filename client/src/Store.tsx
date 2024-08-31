import { configureStore } from '@reduxjs/toolkit'
import headerFilterSlice, { changeDiscoverSubFilter } from './ReduxStore/HeaderFilterSlice';
import userLoggedInReducer from './ReduxStore/UserstateSlice'
import NotificationsSlice from './ReduxStore/NotificationsSlice';
import LoginSlice from './ReduxStore/LoginSlice';

export const store = configureStore({
  reducer: {
    mainfilter: headerFilterSlice,
    user : userLoggedInReducer,
    notifications: NotificationsSlice,
    displayPopUp:LoginSlice
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;