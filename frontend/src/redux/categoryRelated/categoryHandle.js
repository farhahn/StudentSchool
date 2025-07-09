import axios from "axios";
import {
  getRequest,
  getSuccess,
  getError,
  stuffDone,
  clearError,
} from "./categorySlice";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAllCategories = (adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    console.error("fetchAllCategories: No adminID provided");
    return;
  }
  dispatch(getRequest());
  const url = `/categories/${adminID}`;
  console.log("Request URL:", url, "with adminID:", adminID);
  try {
    const response = await api.get(url);
    console.log("Full fetch categories response:", JSON.stringify(response.data, null, 2));
    const categories = Array.isArray(response.data.data) ? response.data.data : [];
    console.log("Dispatched categories:", JSON.stringify(categories, null, 2));
    dispatch(getSuccess(categories));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching categories:", errorMessage, JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const createCategory = (data, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  if (!data.name || !data.description) {
    dispatch(getError("All required fields must be filled"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { name: data.name, description: data.description, adminID };
    console.log("Sending POST /category:", JSON.stringify(payload, null, 2));
    await api.post("/category", payload);
    dispatch(stuffDone());
    dispatch(fetchAllCategories(adminID)); // Refresh the list
    console.log("Triggered fetchAllCategories after create");
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (add):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const updateCategory = ({ id, category, adminID }) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    const payload = { ...category, adminID };
    console.log("Sending PUT /category:", JSON.stringify(payload, null, 2));
    await api.put(`/category/${id}`, payload);
    dispatch(stuffDone());
    dispatch(fetchAllCategories(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (update):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const deleteCategory = (id, adminID) => async (dispatch) => {
  if (!adminID) {
    dispatch(getError("Admin ID is required"));
    return;
  }
  dispatch(getRequest());
  try {
    console.log("Sending DELETE /category:", id, "with adminID:", adminID);
    await api.delete(`/category/${id}?adminID=${adminID}`);
    dispatch(stuffDone());
    dispatch(fetchAllCategories(adminID));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error response from server (delete):", JSON.stringify(error.response?.data, null, 2));
    dispatch(getError(errorMessage));
  }
};

export const clearCategoryError = () => clearError();