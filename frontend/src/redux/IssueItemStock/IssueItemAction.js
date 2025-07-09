import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from './IssueItemSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // Fixed to include /api
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllIssueItems = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return;
  }
  dispatch(getRequest());
  const url = `/issue-items/${adminID}`;
  console.log('Request URL:', url, 'with adminID:', adminID);
  try {
    const response = await api.get(url);
    console.log('Fetch issue items response:', response.data);
    dispatch(getSuccess(response.data.data || []));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching issue items:', errorMessage, error.response?.status);
    dispatch(getError(errorMessage));
  }
};

export const createIssueItem = (data) => async (dispatch) => {
  const { adminID } = data;
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return Promise.reject(new Error('Admin ID is required'));
  }
  if (!data.item || !data.category || !data.issueDate || !data.issueTo || !data.issuedBy || !data.quantity) {
    dispatch(getError('All required fields must be filled'));
    return Promise.reject(new Error('All required fields must be filled'));
  }
  dispatch(getRequest());
  try {
    const payload = {
      item: data.item,
      category: data.category,
      issueDate: data.issueDate,
      issueTo: data.issueTo,
      issuedBy: data.issuedBy,
      quantity: parseInt(data.quantity),
      status: data.status || 'Issued',
      adminID,
    };
    console.log('Sending POST /issue-item:', payload);
    const response = await api.post('/issue-item', payload);
    console.log('Create issue item response:', response.data);
    dispatch(stuffDone());
    dispatch(getAllIssueItems(adminID)); // Refresh the list
    return Promise.resolve(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error creating issue item:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(getError(errorMessage));
    return Promise.reject(error);
  }
};

export const updateIssueItem = ({ id, issueItem }) => async (dispatch) => {
  const { adminID } = issueItem;
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return Promise.reject(new Error('Admin ID is required'));
  }
  dispatch(getRequest());
  try {
    const payload = {
      item: issueItem.item,
      category: issueItem.category,
      issueDate: issueItem.issueDate,
      issueTo: issueItem.issueTo,
      issuedBy: issueItem.issuedBy,
      quantity: parseInt(issueItem.quantity),
      status: issueItem.status,
      adminID,
    };
    console.log('Sending PUT /issue-item:', payload);
    const response = await api.put(`/issue-item/${id}`, payload);
    console.log('Update issue item response:', response.data);
    dispatch(stuffDone());
    dispatch(getAllIssueItems(adminID));
    return Promise.resolve(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating issue item:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(getError(errorMessage));
    return Promise.reject(error);
  }
};

export const deleteIssueItem = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError('Admin ID is required'));
    return Promise.reject(new Error('Admin ID is required'));
  }
  dispatch(getRequest());
  try {
    console.log('Sending DELETE /issue-item:', id, 'with adminID:', adminID);
    const response = await api.delete(`/issue-item/${id}?adminID=${adminID}`);
    console.log('Delete issue item response:', response.data);
    dispatch(stuffDone());
    dispatch(getAllIssueItems(adminID));
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting issue item:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
    dispatch(getError(errorMessage));
    return Promise.reject(error);
  }
};

export const clearIssueItemError = () => clearError();