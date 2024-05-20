import { configureStore } from '@reduxjs/toolkit'
import headerFilterSlice from './HeaderNavbarComponent/HeaderFilterSlice';

export const store = configureStore({
  reducer: {
    mainfilter: headerFilterSlice
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;