import { configureStore } from '@reduxjs/toolkit'
import headerFilterSlice from './HeaderNavbarComponent/HeaderFilterSlice';
import userLoggedInReducer from './HomePageComponent/LoggedInSlice'

export const store = configureStore({
  reducer: {
    mainfilter: headerFilterSlice,
    userLoggedIn : userLoggedInReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;