import { createSlice } from '@reduxjs/toolkit';
import { getUserData } from '../Hooks/UserDataHandler';

const initialState = {
  notifications: [],
  isPopupVisible: false,
  askFeedback: false,
  credits: getUserData()?.credits || 0,
  isLoading: false,
  loadingText: '',
  dontRefreshWarning: true,
  settings: {
    testMode: false,
    usingModel: 1,
    useAdvancedContext: true
  }
}

const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 5000,
      });
      state.isPopupVisible = true;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
      if (state.notifications.length === 0) {
        state.isPopupVisible = false;
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.isPopupVisible = false;
    },
    startLoading: (state, action) => {
      console.log('startLoading', action.payload);
      state.isLoading = true;
      state.loadingText = action.payload.loadingText;
      state.dontRefreshWarning = action.payload.dontRefreshWarning;
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.loadingText = '';
    },
    updateCredits: (state, action) => {
      state.credits = action.payload;
    },
    decrementCredits: (state, action) => {
      state.credits -= action.payload;
    },
    incrementCredits: (state, action) => {
      state.credits += action.payload;
    },
    toggleSetting: (state, action) => {
      const {model} = action.payload
      if(model !== undefined) {
        state.settings.usingModel = model;
      } else {
        state.settings[action.payload] = !state.settings[action.payload];
      }
    },
    setAskFeedback: (state, action) => {
      state.askFeedback = action.payload;
    },
    resetWebsite: (state) => {
      return initialState;
    }
  },
});

export const { 
  addNotification, 
  removeNotification, 
  clearAllNotifications,
  startLoading,
  stopLoading,
  updateCredits,
  decrementCredits, 
  incrementCredits,
  toggleSetting,
  setAskFeedback,
  resetWebsite
} = websiteSlice.actions;

export default websiteSlice.reducer;
