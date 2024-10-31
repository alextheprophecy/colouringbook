import { createSlice } from '@reduxjs/toolkit';
import { getUserData } from '../Hooks/UserDataHandler';

const initialState = {
  notifications: [],
  isPopupVisible: false,
  askFeedback: false,
  credits: getUserData()?.credits || 0,
  settings: {
    testMode: false,
    useFineTunedModel: true,
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
      state.settings[action.payload] = !state.settings[action.payload];
    },
    setAskFeedback: (state, action) => {
      state.askFeedback = action.payload;
    }
  },
});

export const { 
  addNotification, 
  removeNotification, 
  clearAllNotifications,
  updateCredits,
  decrementCredits, 
  incrementCredits,
  toggleSetting,
  setAskFeedback
} = websiteSlice.actions;

export default websiteSlice.reducer;
