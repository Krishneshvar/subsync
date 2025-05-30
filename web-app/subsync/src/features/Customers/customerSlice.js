import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/api/axiosInstance';

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/customer/${id}`);
      return res.data.customer;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch customer';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(`/create-customer`, payload);
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to create customer';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/update-customer/${id}`, payload);
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to update customer';
      return rejectWithValue(errorMessage);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    currentCustomer: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCustomerState: (state) => {
      state.currentCustomer = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerState } = customerSlice.actions;
export default customerSlice.reducer;
