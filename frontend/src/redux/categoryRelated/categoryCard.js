import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearCategoryCardError,
} from './categoryCardSlice';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure /api is included
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllCategoryCards = createAsyncThunk(
  'categoryCard/getAllCategoryCards',
  async (adminID, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.get(`/category-cards/${adminID}`);
      dispatch(getSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

// Other thunks remain the same
export const createCategoryCard = createAsyncThunk(
  'categoryCard/createCategoryCard',
  async (categoryCardData, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.post('/category-card', categoryCardData);
      dispatch(stuffDone());
      await dispatch(getAllCategoryCards(categoryCardData.adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const updateCategoryCard = createAsyncThunk(
  'categoryCard/updateCategoryCard',
  async ({ id, categoryCardData }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.put(`/category-card/${id}`, categoryCardData);
      dispatch(stuffDone());
      await dispatch(getAllCategoryCards(categoryCardData.adminID)).unwrap();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const deleteCategoryCard = createAsyncThunk(
  'categoryCard/deleteCategoryCard',
  async ({ id, adminID }, { dispatch }) => {
    dispatch(getRequest());
    try {
      await api.delete(`/category-card/${id}`, { data: { adminID } });
      dispatch(stuffDone());
      await dispatch(getAllCategoryCards(adminID)).unwrap();
      return { id };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export const searchCategoryCards = createAsyncThunk(
  'categoryCard/searchCategoryCards',
  async ({ adminID, searchQuery }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const response = await api.get(`/category-cards/search/${adminID}`, {
        params: { searchQuery },
      });
      dispatch(getSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(getError(errorMessage));
      throw error;
    }
  }
);

export { clearCategoryCardError };