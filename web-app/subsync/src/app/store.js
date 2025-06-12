import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/Auth/authSlice';
import { authApiSlice } from '../features/Auth/authApiSlice';
import customerReducer from '@/features/Customers/customerSlice';
import itemGroupReducer from '@/features/Services/itemGroupSlice';
import serviceReducer from '@/features/Services/serviceSlice';
// import vendorReducer from '@/features/Services/vendorReducer';
import domainReducer from '@/features/Domains/domainSlice';
import errorMiddleware from '@/app/middlewares/errorMiddleware.js';

import { customerApi } from '@/features/Customers/customerApi.js';
import { paymentTermsApi } from '../features/PaymentTerms/paymentTermsApi';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    services: serviceReducer,
    domains: domainReducer,
    // vendors: vendorReducer,
    itemGroups: itemGroupReducer,
    app: appReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [paymentTermsApi.reducerPath]: paymentTermsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      errorMiddleware,
      customerApi.middleware,
      authApiSlice.middleware,
      paymentTermsApi.middleware,
    ),
});
