import { createSlice } from '@reduxjs/toolkit';
import { customerApi } from '../features/Customers/customerApi';

const initialState = {
  globalLoading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
  // generic matchers to control global loading for all RTK Query requests
  extraReducers: (builder) => {
    builder
      // Match any RTK Query request that is pending
      .addMatcher(customerApi.endpoints.getPaginatedCustomers.matchPending, (state) => {
        state.globalLoading = true;
      })
      .addMatcher(customerApi.endpoints.getCustomerById.matchPending, (state) => {
        state.globalLoading = true;
      })
      .addMatcher(customerApi.endpoints.createCustomer.matchPending, (state) => {
        state.globalLoading = true;
      })
      .addMatcher(customerApi.endpoints.updateCustomer.matchPending, (state) => {
        state.globalLoading = true;
      })
      .addMatcher(customerApi.endpoints.importCustomers.matchPending, (state) => {
        state.globalLoading = true;
      })
      // Match any RTK Query request that is fulfilled or rejected
      .addMatcher(customerApi.endpoints.getPaginatedCustomers.matchFulfilled, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.getCustomerById.matchFulfilled, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.createCustomer.matchFulfilled, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.updateCustomer.matchFulfilled, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.importCustomers.matchFulfilled, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.getPaginatedCustomers.matchRejected, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.getCustomerById.matchRejected, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.createCustomer.matchRejected, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.updateCustomer.matchRejected, (state) => {
        state.globalLoading = false;
      })
      .addMatcher(customerApi.endpoints.importCustomers.matchRejected, (state) => {
        state.globalLoading = false;
      });
  }
});

export const { setGlobalLoading } = appSlice.actions;
export default appSlice.reducer;
