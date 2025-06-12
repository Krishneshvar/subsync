import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApiSlice } from './authApiSlice';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const fetchUserDetailsOnLoad = createAsyncThunk(
  'auth/fetchUserDetailsOnLoad',
  async (_, { dispatch, rejectWithValue }) => {
    try {

      const { user } = await dispatch(authApiSlice.endpoints.getUserDetails.initiate()).unwrap();
      return user;
    } catch (err) {
      return rejectWithValue(err.data?.message || 'Authentication failed on load.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserDetailsOnLoad
      .addCase(fetchUserDetailsOnLoad.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetailsOnLoad.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserDetailsOnLoad.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; // Backend now returns { user: ... }
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(authApiSlice.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.data?.message || 'Login failed.';
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
