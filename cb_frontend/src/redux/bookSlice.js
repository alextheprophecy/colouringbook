import { createSlice } from '@reduxjs/toolkit';

const pagesExample = [
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=1`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=2`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=3`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=4`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=5`, description: "Page 1"},
  { image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=5`, description: "Page 1"},

];

const firstPage = (title="Coloring \n book") => {
  const text = encodeURIComponent(title); // Encode the text to preserve newlines
  return ({
    image: `https://placehold.co/400x600/f1e6cf/000000?text=${text}`, 
    description: "Book Cover"
  })
}

const initialState = {
  pages: [],
  seeds: {advanced: null, fineTuned: null},
  currentContext: '',
  currentPage: 0,
  isEditing: false,
  isLoading: false,
  loadingText: 'Loading...',
  hasBookStarted: false, // New state variable
  isBookFinished: false,
  bookId: 0,
  title: ''
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    addPage: (state, action) => {
      state.pages.push(action.payload);
    },
    updatePage: (state, action) => {
      const { index, data, isRegeneration, isEnhancement } = action.payload;
      if (isRegeneration) data.regenerateCount = (state.pages[index].regenerateCount ?? 0) + 1;
      else if (isEnhancement) data.enhanceCount = (state.pages[index].enhanceCount ?? 0) + 1;    
      state.pages[index] = { ...state.pages[index], ...data };
    },
    updateContext: (state, action) => {
      state.currentContext = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },  
    editPage: (state, action) => {
      state.isEditing = true;
      state.currentPage = action.payload;
    },
    startLoading: (state, action) => {
      state.isLoading = true;
      state.loadingText = action.payload;
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.loadingText = '';
    },
    startBook: (state, action) => {
      const titleInput = action.payload.title;
      state.pages.push(firstPage(titleInput));
      state.hasBookStarted = true;
      state.bookId = action.payload.bookId;
      state.title = titleInput;      
    },
    finishBook: (state) => {
      state.isBookFinished = true;
    },
    setSeeds: (state, action) => {
      state.seeds = { ...state.seeds, ...action.payload};
    },
  },
});

export const { addPage, updatePage, updateContext, setCurrentPage, setIsEditing, startLoading, stopLoading, startBook, finishBook, setSeeds, editPage} = bookSlice.actions;

export default bookSlice.reducer;
