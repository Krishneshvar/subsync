import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

import api from '@/lib/axiosInstance.js';

export const fetchItemGroups = createAsyncThunk(
    "itemGroups/fetchItemGroups",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/all-item-groups");
            console.log("Fetched item groups:", response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createItemGroup = createAsyncThunk(
    "itemGroups/createItemGroup",
    async (itemGroupData, thunkAPI) => {
        try {
            const response = await api.post("/create-item-group", itemGroupData);
            toast.success('Item Group added successfully.');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add item group.');
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateItemGroup = createAsyncThunk(
    "itemGroups/updateItemGroup",
    async ({ id, item_group_name }, thunkAPI) => {
        try {
            const response = await api.put(`/update-item-group/${id}`, { item_group_name });
            toast.success('Item Group updated successfully.');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update item group.');
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteItemGroup = createAsyncThunk(
    "itemGroups/deleteItemGroup",
    async (id, thunkAPI) => {
        try {
            await api.delete(`/delete-item-group/${id}`);
            toast.success('Item Group deleted successfully.');
            return id;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete item group.');
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const itemGroupSlice = createSlice({
    name: "itemGroups",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch all
            .addCase(fetchItemGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItemGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                state.error = null;
            })
            .addCase(fetchItemGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // add
            .addCase(createItemGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createItemGroup.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createItemGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // update
            .addCase(updateItemGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItemGroup.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateItemGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // delete
            .addCase(deleteItemGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteItemGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(itemGroup => itemGroup.item_group_id !== action.payload);
                state.error = null;
            })
            .addCase(deleteItemGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default itemGroupSlice.reducer;
