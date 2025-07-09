import { createSlice } from '@reduxjs/toolkit';

const categoryCardSlice = createSlice({
  name: 'categoryCard',
  initialState: {
    categoryCardsList: [],
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    getSuccess: (state, action) => {
      state.categoryCardsList = action.payload;
      state.loading = false;
      state.error = null;
      state.status = 'success';
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'error';
    },
    stuffDone: (state) => {
      state.loading = false;
      state.status = 'done';
    },
    clearCategoryCardError: (state) => {
      state.error = null;
    },
    createCategoryCardLocally: (state, action) => {
      state.categoryCardsList.unshift(action.payload);
    },
    updateCategoryCardLocally: (state, action) => {
      const index = state.categoryCardsList.findIndex((card) => card._id === action.payload.id);
      if (index !== -1) {
        state.categoryCardsList[index] = action.payload.categoryCardData;
      }
    },
    deleteCategoryCardLocally: (state, action) => {
      state.categoryCardsList = state.categoryCardsList.filter((card) => card._id !== action.payload);
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearCategoryCardError,
  createCategoryCardLocally,
  updateCategoryCardLocally,
  deleteCategoryCardLocally,
} = categoryCardSlice.actions;
export default categoryCardSlice.reducer;