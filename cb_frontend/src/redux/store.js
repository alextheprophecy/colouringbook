import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './bookSlice';
import websiteReducer from './websiteSlice';

const store = configureStore({
  reducer: {
    book: bookReducer,
    website: websiteReducer,
  },
});

export default store;
