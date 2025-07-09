import axios from 'axios';
import {
  fetchDisabledStudentsRequest,
  fetchDisabledStudentsSuccess,
  fetchDisabledStudentsError,
  createDisabledStudentRequest,
  createDisabledStudentSuccess,
  createDisabledStudentError,
  updateDisabledStudentRequest,
  updateDisabledStudentSuccess,
  updateDisabledStudentError,
  deleteDisabledStudentRequest,
  deleteDisabledStudentSuccess,
  deleteDisabledStudentError,
} from './disabledStudentSlice';

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

export const fetchAllDisabledStudents = (adminID) => async (dispatch) => {
  dispatch(fetchDisabledStudentsRequest());
  try {
    console.log(`Fetching disabled students for adminID: ${adminID}`);
    const response = await api.get(`/disabled-students/${adminID}`);
    console.log('Fetch disabled students response:', response.data);
    dispatch(fetchDisabledStudentsSuccess(response.data.data || []));
    return response.data.data || [];
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error fetching disabled students:', errorMessage, error.response);
    dispatch(fetchDisabledStudentsError(errorMessage));
    throw error;
  }
};

export const createDisabledStudent = (adminID, disabledStudentData) => async (dispatch) => {
  dispatch(createDisabledStudentRequest());
  try {
    console.log(`Request URL: /disabled-students/${adminID}`, disabledStudentData);
    const response = await api.post(`/disabled-students/${adminID}`, disabledStudentData);
    console.log('Create disabled student response:', response.data);
    dispatch(createDisabledStudentSuccess(response.data.data));
    return { success: true, data: response.data.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error creating disabled student:', errorMessage, error);
    dispatch(createDisabledStudentError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const updateDisabledStudent = (adminID, disabledStudentId, disabledStudentData) => async (dispatch) => {
  dispatch(updateDisabledStudentRequest());
  try {
    console.log(`Request URL: /disabled-students/${adminID}/${disabledStudentId}`, disabledStudentData);
    const response = await api.put(`/disabled-students/${adminID}/${disabledStudentId}`, disabledStudentData);
    console.log('Update disabled student response:', response.data);
    dispatch(updateDisabledStudentSuccess(response.data.data));
    return { success: true, data: response.data.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error updating disabled student:', errorMessage, error);
    dispatch(updateDisabledStudentError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const deleteDisabledStudent = (adminID, disabledStudentId) => async (dispatch) => {
  dispatch(deleteDisabledStudentRequest());
  try {
    console.log(`Request URL: /disabled-students/${adminID}/${disabledStudentId}`);
    const response = await api.delete(`/disabled-students/${adminID}/${disabledStudentId}`);
    console.log('Delete disabled student response:', response.data);
    dispatch(deleteDisabledStudentSuccess(disabledStudentId));
    return { success: true, id: disabledStudentId };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Error deleting disabled student:', errorMessage, error);
    dispatch(deleteDisabledStudentError(errorMessage));
    return { success: false, error: errorMessage };
  }
};