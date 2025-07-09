import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  fetchReasonsSuccess,
  fetchReasonsError,
  createReasonSuccess,
  createReasonError,
  updateReasonSuccess,
  updateReasonError,
  deleteReasonSuccess,
  deleteReasonError,
} from './reasonSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAllReasons = createAsyncThunk(
  'reason/fetchAllReasons',
  async (adminID, { rejectWithValue }) => {
    try {
      console.log(`Request URL: /reasons/${adminID}`);
      const response = await api.get(`/reasons/${adminID}`);
      console.log('Fetch reasons response:', response.data);
      return response.data.data || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error fetching reasons:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createReason = createAsyncThunk(
  'reason/createReason',
  async ({ adminID, text }, { rejectWithValue }) => {
    try {
      console.log(`Request URL: /reasons/${adminID}`, { text });
      const response = await api.post(`/reasons/${adminID}`, { text });
      console.log('Create reason response:', response.data);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error creating reason:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateReason = createAsyncThunk(
  'reason/updateReason',
  async ({ adminID, reasonId, text }, { rejectWithValue }) => {
    try {
      console.log(`Request URL: /reasons/${adminID}/${reasonId}`, { text });
      const response = await api.put(`/reasons/${adminID}/${reasonId}`, { text });
      console.log('Update reason response:', response.data);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error updating reason:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteReason = createAsyncThunk(
  'reason/deleteReason',
  async ({ adminID, reasonId }, { rejectWithValue }) => {
    try {
      console.log(`Request URL: /reasons/${adminID}/${reasonId}`);
      const response = await api.delete(`/reasons/${adminID}/${reasonId}`);
      console.log('Delete reason response:', response.data);
      return reasonId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error deleting reason:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);