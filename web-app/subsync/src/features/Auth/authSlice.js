import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiLoginUser } from './services/authApi';

const storedUser = localStorage.getItem('subsync_user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser', // This is the action type prefix
  async ({ username, password }, thunkAPI) => {
    try {
      const userData = await apiLoginUser(username, password);
      localStorage.setItem('subsync_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || 'Login failed.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('subsync_user');
    },
    // You could add a reducer here to clear login errors manually if needed:
    // clearLoginError: (state) => {
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      // Case when loginUser thunk is pending
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Case when loginUser thunk is fulfilled (successful)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      // Case when loginUser thunk is rejected (failed)
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
