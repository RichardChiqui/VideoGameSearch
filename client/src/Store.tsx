import { configureStore } from '@reduxjs/toolkit'
import headerFilterSlice from './HeaderNavbarComponent/HeaderFilterSlice';
import userLoggedInReducer from './HomePageComponent/LoggedInSlice'
import NotificationsSlice from './HeaderNavbarComponent/NotificationsSlice';

export const store = configureStore({
  reducer: {
    mainfilter: headerFilterSlice,
    userLoggedIn : userLoggedInReducer,
    notifications: NotificationsSlice
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;