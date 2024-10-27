import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  isPopupVisible: false,
};

const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        type: action.payload.type || 'info', // 'success', 'error', 'info', 'warning'
        message: action.payload.message,
        duration: action.payload.duration || 5000, // Default 5 seconds
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
  },
});

export const { addNotification, removeNotification, clearAllNotifications } = websiteSlice.actions;
export default websiteSlice.reducer;
