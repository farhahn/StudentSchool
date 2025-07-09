import axios from 'axios';
import {
  fetchRequest,
  fetchSuccess,
  fetchFailed,
  addOrUpdateSuccess,
  getDetailsSuccess,
  deleteSuccess,
  clearError,
  operationFailed,
} from './storeSlice.js';

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
  console.log('Request:', config.method.toUpperCase(), config.url, config.data || '');
  return config;
});

// Get all Stores by Admin ID
export const getAllStores = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(fetchFailed('Admin ID is required'));
    return;
  }
  dispatch(fetchRequest());
  try {
    const result = await api.get(`/StoreList?adminID=${adminID}`);
    console.log('Full fetch stores response:', JSON.stringify(result, null, 2));
    dispatch(fetchSuccess(result.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching stores:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(fetchFailed(errorMessage));
  }
};

// Get Store details by ID
export const getStoreDetails = (id) => async (dispatch) => {
  if (!id) {
    dispatch(fetchFailed('Store ID is required'));
    return;
  }
  dispatch(fetchRequest());
  try {
    const result = await api.get(`/Store/${id}`);
    console.log('Fetch store details response:', JSON.stringify(result.data, null, 2));
    dispatch(getDetailsSuccess(result.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching store details:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(fetchFailed(errorMessage));
  }
};

// Create Store
export const createStore = (data) => async (dispatch) => {
  const { adminID } = data;
  if (!adminID) {
    dispatch(operationFailed('Admin ID is required'));
    return Promise.reject(new Error('Admin ID is required'));
  }
  dispatch(fetchRequest());
  try {
    const result = await api.post('/StoreCreate', data);
    console.log('Create store response:', JSON.stringify(result.data, null, 2));
    dispatch(addOrUpdateSuccess(result.data.store));
    dispatch(getAllStores(adminID));
    return Promise.resolve(result.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error creating store:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(operationFailed(errorMessage));
    return Promise.reject(error);
  }
};

// Update Store
export const updateStore = (id, data) => async (dispatch) => {
  const { adminID } = data;
  if (!adminID) {
    dispatch(operationFailed('Admin ID is required'));
    return Promise.reject(new Error('Admin ID is required'));
  }
  dispatch(fetchRequest());
  try {
    const result = await api.put(`/Store/${id}`, data);
    console.log('Update store response:', JSON.stringify(result.data, null, 2));
    dispatch(addOrUpdateSuccess(result.data.store));
    dispatch(getAllStores(adminID));
    return Promise.resolve(result.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating store:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(operationFailed(errorMessage));
    return Promise.reject(error);
  }
};

// Delete Store with Admin ID
export const deleteStore = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(operationFailed('Admin ID is required'));
    return Promise.reject(new Error('Admin ID is required'));
  }
  dispatch(fetchRequest());
  try {
    const result = await api.delete(`/Store/${id}?adminID=${adminID}`);
    console.log('Delete store response:', JSON.stringify(result.data, null, 2));
    dispatch(deleteSuccess(id));
    dispatch(getAllStores(adminID));
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting store:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(operationFailed(errorMessage));
    return Promise.reject(error);
  }
};

// Clear Errors
export const clearStoreError = () => (dispatch) => {
  dispatch(clearError());
};