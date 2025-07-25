import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = "pending";
      console.log("getRequest: Setting loading to true");
    },
    getSuccess: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
      state.status = "success";
      console.log("getSuccess: Updated categories:", JSON.stringify(action.payload, null, 2));
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "error";
      console.error("getError: Error in category slice:", action.payload);
    },
    stuffDone: (state) => {
      state.loading = false;
      state.status = "done";
      console.log("stuffDone: Operation completed");
    },
    clearError: (state) => {
      state.error = null;
      console.log("clearError: Cleared error");
    },
  },
});

export const { getRequest, getSuccess, getError, stuffDone, clearError } = categorySlice.actions;
export default categorySlice.reducer;