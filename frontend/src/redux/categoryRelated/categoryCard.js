// // frontend/src/CategoryCardSlice.js
// import axios from 'axios';
// import {
//   getRequest,
//   getSuccess,
//   getError,
//   stuffDone,
//   clearError,
// } from './categoryCardSlice';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const getAllCategoryCards = (adminID) => async (dispatch) => {
//   if (!adminID) {
//     dispatch(getError('Admin ID is required'));
//     return;
//   }
//   dispatch(getRequest());
//   const url = `/category-cards/${adminID}`;
//   console.log('Request URL:', url, 'with adminID:', adminID);
//   try {
//     const response = await api.get(url);
//     console.log('Fetch category cards response:', response.data);
//     dispatch(getSuccess(response.data.data || []));
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message;
//     console.error('Error fetching category cards:', errorMessage);
//     dispatch(getError(errorMessage));
//   }
// };

// export const createCategoryCard = (data, adminID) => async (dispatch, getState) => {
//   if (!adminID) {
//     dispatch(getError('Admin ID is required'));
//     return;
//   }
//   if (!data.category || !data.description) {
//     dispatch(getError('Category name and description are required'));
//     return;
//   }
//   dispatch(getRequest());
//   try {
//     const payload = { ...data, adminID };
//     console.log('Sending POST /category-card:', payload);
//     const response = await api.post('/category-card', payload);
//     const currentCategoryCards = getState().categoryCard.categoryCardsList;
//     dispatch(getSuccess([...currentCategoryCards, response.data.data]));
//     dispatch(stuffDone());
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message;
//     console.error('Error response from server (add):', JSON.stringify(error.response?.data, null, 2));
//     dispatch(getError(errorMessage));
//   }
// };

// export const updateCategoryCard = ({ id, categoryCard, adminID }) => async (dispatch) => {
//   if (!adminID) {
//     dispatch(getError('Admin ID is required'));
//     return;
//   }
//   dispatch(getRequest());
//   try {
//     const payload = { ...categoryCard, adminID };
//     console.log('Sending PUT /category-card:', payload);
//     await api.put(`/category-card/${id}`, payload);
//     dispatch(stuffDone());
//     dispatch(getAllCategoryCards(adminID));
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message;
//     console.error('Error response from server (update):', JSON.stringify(error.response?.data, null, 2));
//     dispatch(getError(errorMessage));
//   }
// };

// export const deleteCategoryCard = (id, adminID) => async (dispatch) => {
//   if (!adminID) {
//     dispatch(getError('Admin ID is required'));
//     return;
//   }
//   dispatch(getRequest());
//   try {
//     console.log('Sending DELETE /category-card:', id, 'with adminID:', adminID);
//     await api.delete(`/category-card/${id}?adminID=${adminID}`);
//     dispatch(stuffDone());
//     dispatch(getAllCategoryCards(adminID));
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message;
//     console.error('Error response from server (delete):', JSON.stringify(error.response?.data, null, 2));
//     dispatch(getError(errorMessage));
//   }
// };

// export const clearCategoryCardError = () => clearError;