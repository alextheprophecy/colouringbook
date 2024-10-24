import { createSlice } from '@reduxjs/toolkit';

const pagesExample = [
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=1`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=2`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=3`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=4`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=5`, description: "Page 1"},

];

const firstPage = () => {
  const text = encodeURIComponent("My Colouring\nBook"); // Encode the text to preserve newlines
  return ({
    image: `https://placehold.co/400x600/f1e6cf/000000?text=${text}`, 
    description: "Book Cover"
  })
}

const initialState = {
  pages: [firstPage(), ...pagesExample],
  currentPage: 0,
  isEditing: false,
  isModifyingBook: false,
  isLoading: false,
  loadingText: 'Loading...',
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
      console.log("Updating page", index, data);
      console.log(action.payload);
      state.pages[index] = { ...state.pages[index], ...data };
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
    startLoading: (state, action) => {
      state.isLoading = true;
      state.loadingText = action.payload;
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.loadingText = '';
    },
  },
});

export const { addPage, updatePage, setCurrentPage, setIsEditing, setIsModifyingBook, startLoading, stopLoading } = bookSlice.actions;

export default bookSlice.reducer;
