import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pages: [],
  currentPage: 0,
  isEditing: false,
  isModifyingBook: false,
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    addPage: (state, action) => {
      state.pages.push(action.payload);
    },
    updatePage: (state, action) => {
      const { index, data } = action.payload;
      state.pages[index] = data;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    setIsModifyingBook: (state, action) => {
      state.isModifyingBook = action.payload;
    },
  },
});

export const { addPage, updatePage, setCurrentPage, setIsEditing, setIsModifyingBook } = bookSlice.actions;

export default bookSlice.reducer;
