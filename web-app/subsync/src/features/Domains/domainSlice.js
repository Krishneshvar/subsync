import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axiosInstance.js';

// Thunks
export const fetchDomains = createAsyncThunk(
  'domains/fetchDomains',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/all-domains', { params });
      return res.data.domains;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch domains');
    }
  }
);

export const fetchDomainById = createAsyncThunk(
  'domains/fetchDomainById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/domain/${id}`);
      return res.data.domain;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch domain');
    }
  }
);

export const createDomain = createAsyncThunk(
  'domains/createDomain',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/create-domain', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create domain');
    }
  }
);

export const updateDomain = createAsyncThunk(
  'domains/updateDomain',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/update-domain/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update domain');
    }
  }
);

// Slice
const domainSlice = createSlice({
  name: 'domains',
  initialState: {
    list: [],
    currentDomain: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDomainState: (state) => {
      state.currentDomain = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDomains.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDomainById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDomainById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDomain = action.payload;
      })
      .addCase(fetchDomainById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDomain.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDomain.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDomain.fulfilled, (state, action) => {
      state.loading = false;

      // Update the domain in the list if it exists
      const updated = action.payload;
      const index = state.list.findIndex(domain => domain.domain_id === updated.domain_id);
      if (index !== -1) {
        state.list[index] = updated;
      }
    })
      .addCase(updateDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDomainState } = domainSlice.actions;
export default domainSlice.reducer;