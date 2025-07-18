import axios from 'axios';
import { getRequest, getSuccess, getError, stuffDone, clearError } from './itemStockSlice';

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

export const getAllStockItems = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/stock-items/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch stock items response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching stock items:', errorMessage);
    dispatch(getError(errorMessage));
  }
};

export const createStockItem = (data, adminID) => async (dispatch, getState) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  if (!data.itemName || !data.category || !data.supplier || !data.quantity || !data.purchasePrice || !data.purchaseDate) {
    dispatch(getError('All required fields must be provided'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...data, adminID };
    console.log('Sending POST /stock-item:', payload);
    const response = await api.post('/stock-item', payload);
    const currentStockItems = getState().stockItem.stockItemsList;
    dispatch(getSuccess([...currentStockItems, response.data.data]));
    dispatch(stuffDone());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateStockItem = ({ id, stockItem, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...stockItem, adminID };
    console.log('Sending PUT /stock-item:', payload);
    await api.put(`/stock-item/${id}`, payload);
    dispatch(stuffDone());
    dispatch(getAllStockItems(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteStockItem = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /stock-item:', id, 'with adminID:', adminID);
    await api.delete(`/stock-item/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(getAllStockItems(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearStockItemError = () => clearError;