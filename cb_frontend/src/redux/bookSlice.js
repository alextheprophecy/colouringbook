import { createSlice } from '@reduxjs/toolkit';

const pagesExample = [
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=1`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=2`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=3`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=4`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=5`, description: "Page 1"},

];
const initialState = {
  pages: pagesExample,
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
