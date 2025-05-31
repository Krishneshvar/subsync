import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/Auth/authSlice';
import customerReducer from '@/features/Customers/customerSlice';
import itemGroupReducer from '@/features/Services/itemGroupSlice';
import serviceReducer from '@/features/Services/serviceSlice';
import vendorReducer from '@/features/Services/vendorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    services: serviceReducer,
    vendors: vendorReducer,
    itemGroups: itemGroupReducer,
  },
});
