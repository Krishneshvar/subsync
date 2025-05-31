import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '@/api/axiosInstance';
import { toast } from 'react-toastify';

export const addService = createAsyncThunk("services/addService", async (data, thunkAPI) => {
    try {
        const res = await api.post("/create-service", data);
        toast.success('Service added successfully!');
        return res.data;
    } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to add service.';
        toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
    }
});

export const fetchServices = createAsyncThunk(
    "services/fetchServices",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/all-services"); // Endpoint to get all services
            // Assuming backend returns { services: [...] }
            return response.data.services;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch services.';
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const fetchServiceById = createAsyncThunk(
    "services/fetchServiceById",
    async (id, thunkAPI) => {
        try {
            const res = await api.get(`/service/${id}`);
            return res.data.service;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch service.';
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const updateService = createAsyncThunk(
    "services/updateService",
    async ({ id, serviceData }, thunkAPI) => {
        try {
            const response = await api.put(`/update-service/${id}`, serviceData); // Changed to PUT
            toast.success('Service updated successfully!');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update service.';
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const deleteService = createAsyncThunk(
    "services/deleteService",
    async (serviceId, thunkAPI) => {
        try {
            await api.delete(`/delete-service/${serviceId}`); // Endpoint to delete a service
            toast.success('Service deleted successfully!');
            return serviceId; // Return the ID of the deleted service to update state
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to delete service.';
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);


const serviceSlice = createSlice({
    name: "services",
    initialState: {
        list: [],
        currentService: null,
        loading: false,
        error: null
    },
    reducers: {
        clearServiceError: (state) => {
            state.error = null;
        },
        clearCurrentService: (state) => {
            state.currentService = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Add Service
            .addCase(addService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addService.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                // Optionally refetch services or add the new service to the list
            })
            .addCase(addService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Services
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                state.error = null;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetch by ID
            .addCase(fetchServiceById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentService = null;
            })
            .addCase(fetchServiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentService = action.payload;
                state.error = null;
            })
            .addCase(fetchServiceById.rejected, (state, action) => {
                state.loading = false;
                state.currentService = null;
                state.error = action.payload;
            })
            // Update Service
            .addCase(updateService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateService.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                // Optionally refetch services or update the specific service in the list
            })
            .addCase(updateService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Service
            .addCase(deleteService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(service => service.service_id !== action.payload);
                state.error = null;
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearServiceError, clearCurrentService } = serviceSlice.actions;
export default serviceSlice.reducer;
