import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// convert snake_case to camelCase for objects
const transformKeysToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(o => transformKeysToCamelCase(o));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelKey] = transformKeysToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

// convert camelCase to snake_case for an object
const transformKeysToSnakeCase = (obj) => {
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      acc[snakeKey] = obj[key];
      return acc;
    }, {});
  }
  return obj;
};

export const paymentTermsApi = createApi({
  reducerPath: 'paymentTermsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['PaymentTerm'],
  endpoints: (builder) => ({
    getPaymentTerms: builder.query({
      query: () => '/payment-terms',
      transformResponse: (response) => transformKeysToCamelCase(response),
      providesTags: ['PaymentTerm'],
    }),
    addPaymentTerm: builder.mutation({
      query: (newTerm) => ({
        url: '/payment-terms',
        method: 'POST',
        body: transformKeysToSnakeCase(newTerm),
      }),
      invalidatesTags: ['PaymentTerm'],
    }),
    updatePaymentTerm: builder.mutation({
      query: ({ termId, ...patch }) => ({
        url: `/payment-terms/${termId}`,
        method: 'PUT',
        body: transformKeysToSnakeCase(patch),
      }),
      invalidatesTags: ['PaymentTerm'],
    }),
    deletePaymentTerm: builder.mutation({
      query: (termId) => ({
        url: `/payment-terms/${termId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentTerm'],
    }),
    setDefaultPaymentTerm: builder.mutation({
      query: (termId) => ({
        url: `/payment-terms/${termId}/default`,
        method: 'PUT',
      }),
      invalidatesTags: ['PaymentTerm'],
    }),
  }),
});

export const {
  useGetPaymentTermsQuery,
  useAddPaymentTermMutation,
  useUpdatePaymentTermMutation,
  useDeletePaymentTermMutation,
  useSetDefaultPaymentTermMutation,
} = paymentTermsApi;
