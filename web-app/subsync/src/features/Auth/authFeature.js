import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- authApiSlice Definition ---
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL, // Ensure this env var is correct
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // You might want to access tokens from state here if needed
    // const token = (getState() as RootState).auth.token;
    // if (token) {
    //   headers.set('authorization', `Bearer ${token}`);
    // }
    return headers;
  },
});

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login/user',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUserDetails: builder.query({
      query: () => ({
        url: '/user/me',
        method: 'GET',
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

// Export RTK Query hooks directly from here
export const {
  useLoginMutation,
  useGetUserDetailsQuery,
  useLogoutMutation,
} = authApiSlice;


// --- authSlice Definition ---
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create the async thunk here (it now references authApiSlice from the same file)
export const fetchUserDetailsOnLoad = createAsyncThunk(
  'auth/fetchUserDetailsOnLoad',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Ensure authApiSlice.endpoints.getUserDetails is available
      const { user } = await dispatch(authApiSlice.endpoints.getUserDetails.initiate()).unwrap();
      return user;
    } catch (err) {
      // Access err.data?.message as per your error structure
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
    // Both fetchUserDetailsOnLoad and authApiSlice.endpoints.login are now in the same scope
    builder
      // Async thunk cases
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
      // RTK Query matcher cases
    //   .addCase(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.user = action.payload.user; // Assuming backend returns { user: ... }
    //     state.isAuthenticated = true;
    //     state.error = null;
    //   })
    //   .addCase(authApiSlice.endpoints.login.matchRejected, (state, action) => {
    //     state.isLoading = false;
    //     state.user = null;
    //     state.isAuthenticated = false;
    //     state.error = action.payload?.data?.message || 'Login failed.';
    //   });
  },
});

// Export slice action creators and the reducer as named exports
export const { logout, setCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
