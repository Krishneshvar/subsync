import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice';
import customerReducer from '../features/Customers/customerSlice';
import serviceReducer from '../features/Services/serviceSlice';
import vendorReducer from '../features/Services/vendorSlice';
import itemGroupReducer from '../features/Services/itemGroupSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    services: serviceReducer,
    vendors: vendorReducer,
    itemGroups: itemGroupReducer,
  },
});
