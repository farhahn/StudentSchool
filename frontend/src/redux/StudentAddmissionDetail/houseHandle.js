import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

export const fetchAllHouses = createAsyncThunk(
  'house/fetchAllHouses',
  async (adminID, { rejectWithValue }) => {
    try {
      console.log(`Fetching houses for adminID: ${adminID}`);
      console.log(`Request URL: /houses/${adminID}`);
      const response = await api.get(`/houses/${adminID}`);
      console.log('Fetch houses response:', response.data);
      return response.data.data || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error fetching houses:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createHouse = createAsyncThunk(
  'house/createHouse',
  async ({ adminID, houseData }, { rejectWithValue }) => {
    try {
      console.log('Creating house with inputs:', { adminID, houseData });
      console.log(`Request URL: /houses/${adminID}`);
      const response = await api.post(`/houses/${adminID}`, houseData);
      console.log('Create house response:', response.data);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error creating house:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteHouse = createAsyncThunk(
  'house/deleteHouse',
  async ({ adminID, houseId }, { rejectWithValue }) => {
    try {
      console.log(`Deleting house with adminID: ${adminID}, houseId: ${houseId}`);
      console.log(`Request URL: /houses/${adminID}/${houseId}`);
      const response = await api.delete(`/houses/${adminID}/${houseId}`);
      console.log('Delete house response:', response.data);
      return houseId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error deleting house:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);