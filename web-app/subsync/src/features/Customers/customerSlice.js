import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    currentCustomer: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCustomerState: (state) => {
      state.currentCustomer = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { clearCustomerState } = customerSlice.actions;
export default customerSlice.reducer;
