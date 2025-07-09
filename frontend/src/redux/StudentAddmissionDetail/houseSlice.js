import { createSlice } from '@reduxjs/toolkit';
import { fetchAllHouses, createHouse, deleteHouse } from './houseHandle';

const houseSlice = createSlice({
  name: 'house',
  initialState: {
    houses: [],
    newHouse: { name: '', description: '', class: '' },
    search: '',
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    setNewHouse: (state, action) => {
      state.newHouse = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    resetHouse: (state) => {
      state.houses = [];
      state.newHouse = { name: '', description: '', class: '' };
      state.search = '';
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllHouses
      .addCase(fetchAllHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchAllHouses.fulfilled, (state, action) => {
        console.log('fetchAllHouses fulfilled payload:', JSON.stringify(action.payload, null, 2));
        state.houses = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(fetchAllHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch houses';
        state.status = 'failed';
        console.error('fetchAllHouses error:', action.payload);
      })
      // createHouse
      .addCase(createHouse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(createHouse.fulfilled, (state, action) => {
        state.houses.push(action.payload);
        state.newHouse = { name: '', description: '', class: '' };
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(createHouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create house';
        state.status = 'failed';
        console.error('createHouse error:', action.payload);
      })
      // deleteHouse
      .addCase(deleteHouse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(deleteHouse.fulfilled, (state, action) => {
        state.houses = state.houses.filter((house) => house._id !== action.payload);
        state.loading = false;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(deleteHouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete house';
        state.status = 'failed';
        console.error('deleteHouse error:', action.payload);
      });
  },
});

export const { setNewHouse, setSearch, resetHouse } = houseSlice.actions;

export default houseSlice.reducer;