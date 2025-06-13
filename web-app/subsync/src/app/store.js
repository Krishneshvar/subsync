// store.js
import { configureStore } from '@reduxjs/toolkit';

// 1. Import all elements from the combined authFeature.js file
import { authApiSlice, authReducer } from '../features/Auth/authFeature'; // Adjusted import path

// Import other RTK Query API slices
import { customerApi } from '@/features/Customers/customerApi.js';
import { paymentTermsApi } from '../features/PaymentTerms/paymentTermsApi';

// Import other regular Redux slices
import customerReducer from '@/features/Customers/customerSlice';
import itemGroupReducer from '@/features/Services/itemGroupSlice';
import serviceReducer from '@/features/Services/serviceSlice';
import domainReducer from '@/features/Domains/domainSlice';
import appReducer from './appSlice';

// Import general middlewares
import errorMiddleware from '@/app/middlewares/errorMiddleware.js';

export const store = configureStore({
  reducer: {
    // Add RTK Query API reducers first
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [paymentTermsApi.reducerPath]: paymentTermsApi.reducer,

    // Then add your regular Redux slices
    auth: authReducer, // Now imported from the combined file
    customers: customerReducer,
    services: serviceReducer,
    domains: domainReducer,
    itemGroups: itemGroupReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware, // Middleware from the combined file
      customerApi.middleware,
      paymentTermsApi.middleware,
      errorMiddleware,
    ),
  devTools: process.env.NODE_ENV !== 'production',
});
