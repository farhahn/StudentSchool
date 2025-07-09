import { createSlice } from '@reduxjs/toolkit';
import { fetchAllReasons, createReason, updateReason, deleteReason } from './reasonHandle';

const reasonSlice = createSlice({
  name: 'reason',
  initialState: {
    reasons: [],
    newReason: '',
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    setNewReason: (state, action) => {
      state.newReason = action.payload;
    },
    setEditReason: (state, action) => {
      state.reasons = state.reasons.map((reason) =>
        reason._id === action.payload.id ? { ...reason, text: action.payload.text } : reason
      );
    },
    toggleEditReason: (state, action) => {
      state.reasons = state.reasons.map((reason) =>
        reason._id === action.payload ? { ...reason, isEditing: !reason.isEditing } : reason
      );
    },
    resetReason: (state) => {
      state.reasons = [];
      state.newReason = '';
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReasons.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchAllReasons.fulfilled, (state, action) => {
        console.log('fetchAllReasons fulfilled payload:', JSON.stringify(action.payload, null, 2));
        state.reasons = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(fetchAllReasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reasons';
        state.status = 'failed';
        console.error('Error in reason slice:', action.payload);
      })
      .addCase(createReason.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(createReason.fulfilled, (state, action) => {
        state.reasons.push(action.payload);
        state.newReason = '';
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(createReason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create reason';
        state.status = 'failed';
        console.error('Error in reason slice:', action.payload);
      })
      .addCase(updateReason.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(updateReason.fulfilled, (state, action) => {
        state.reasons = state.reasons.map((reason) =>
          reason._id === action.payload._id ? { ...action.payload, isEditing: false } : reason
        );
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(updateReason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update reason';
        state.status = 'failed';
        console.error('Error in reason slice:', action.payload);
      })
      .addCase(deleteReason.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(deleteReason.fulfilled, (state, action) => {
        state.reasons = state.reasons.filter((reason) => reason._id !== action.payload);
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(deleteReason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete reason';
        state.status = 'failed';
        console.error('Error in reason slice:', action.payload);
      });
  },
});

export const {
  setNewReason,
  setEditReason,
  toggleEditReason,
  resetReason,
} = reasonSlice.actions;

export default reasonSlice.reducer;