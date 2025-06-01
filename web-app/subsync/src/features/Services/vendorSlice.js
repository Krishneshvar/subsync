import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import api from '@/lib/axiosInstance.js';

export const fetchVendors = createAsyncThunk(
    "vendors/fetchVendors",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/all-vendors");
            console.log("Fetched vendors:", response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createVendor = createAsyncThunk(
    "vendors/createVendor",
    async (vendorData, thunkAPI) => {
        try {
            const response = await api.post("/create-vendor", vendorData);
            toast.success('Vendor added successfully.');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add vendor.');
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateVendor = createAsyncThunk(
    "vendors/updateVendor",
    async ({ id, vendor_name }, thunkAPI) => {
        try {
            const response = await api.put(`/update-vendor/${id}`, { vendor_name });
            toast.success('Vendor updated successfully.');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update vendor.');
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteVendor = createAsyncThunk(
    "vendors/deleteVendor",
    async (id, thunkAPI) => {
        try {
            await api.delete(`/delete-vendor/${id}`);
            toast.success('Vendor deleted successfully.');
            return id;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete vendor.');
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const vendorSlice = createSlice({
    name: "vendors",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // read
            .addCase(fetchVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                state.error = null;
            })
            .addCase(fetchVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // create
            .addCase(createVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVendor.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally add the new vendor to the list or rely on re-fetching
                // For simplicity and immediate UI update, we can add it if the backend returns the full vendor object
                // If backend only returns id, a re-fetch is better. Given current backend, re-fetch is safest.
                // state.list.push(action.payload); // This depends on the exact payload structure
                state.error = null;
            })
            .addCase(createVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // update
            .addCase(updateVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVendor.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(vendor => vendor.vendor_id === action.meta.arg.id);
                if (index !== -1) {
                    state.list[index] = { ...state.list[index], ...action.meta.arg };
                }
                state.error = null;
            })
            .addCase(updateVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // delete
            .addCase(deleteVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(vendor => vendor.vendor_id !== action.payload);
                state.error = null;
            })
            .addCase(deleteVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default vendorSlice.reducer;
