import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice';
import customerReducer from '../features/Customers/customerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
  },
});
