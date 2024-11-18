import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import bookReducer from './bookSlice';
import websiteReducer from './websiteSlice';

const bookPersistConfig = {
  key: 'book',
  storage,
  // Optionally blacklist certain state attributes you don't want to persist
  blacklist: ['workingOnPage']
};

const websitePersistConfig = {
  key: 'website',
  storage,
  // Optionally blacklist certain state attributes you don't want to persist
  blacklist: ['isLoading', 'loadingText', 'notifications', 'isPopupVisible']
};

const persistedBookReducer = persistReducer(bookPersistConfig, bookReducer);
const persistedWebsiteReducer = persistReducer(websitePersistConfig, websiteReducer);

const store = configureStore({
  reducer: {
    book: persistedBookReducer,
    website: persistedWebsiteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

// Add reset function
export const resetPersistedState = async () => {
  await persistor.purge(); // This will clear the persisted state
};

export default store;
