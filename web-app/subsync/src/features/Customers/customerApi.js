import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    getPaginatedCustomers: builder.query({
      query: ({ search = '', sort = 'display_name', order = 'asc', page = 1, limit = 10 }) => ({
        url: '/customers',
        params: { search, sort, order, page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.customers.map(({ customer_id }) => ({ type: 'Customer', id: customer_id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
      transformResponse: (response) => {
        return {
          customers: response.customers.map(customer => ({
            ...customer,
            customerId: customer.customer_id,
            firstName: customer.first_name,
            lastName: customer.last_name,
            primaryEmail: customer.primary_email,
            primaryPhoneNumber: customer.primary_phone_number,
            secondaryPhoneNumber: customer.secondary_phone_number,
            customerAddress: JSON.parse(customer.customer_address || '{}'),
            otherContacts: JSON.parse(customer.other_contacts || '[]'),
            companyName: customer.company_name,
            displayName: customer.display_name,
            gstin: customer.gst_in,
            currencyCode: customer.currency_code,
            gstTreatment: customer.gst_treatment,
            taxPreference: customer.tax_preference,
            exemptionReason: customer.exemption_reason,
            paymentTerms: JSON.parse(customer.payment_terms || '{}'),
            customerStatus: customer.customer_status,
            createdAt: customer.created_at,
            updatedAt: customer.updated_at,
          })),
          totalPages: response.totalPages,
        };
      },
    }),

    getCustomerById: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
      transformResponse: (response) => {
        const customer = response.customer;
        return customer ? {
          ...customer,
          customerId: customer.customer_id,
          firstName: customer.first_name,
          lastName: customer.last_name,
          primaryEmail: customer.primary_email,
          primaryPhoneNumber: customer.primary_phone_number,
          secondaryPhoneNumber: customer.secondary_phone_number,
          customerAddress: JSON.parse(customer.customer_address || '{}'),
          otherContacts: JSON.parse(customer.other_contacts || '[]'),
          companyName: customer.company_name,
          displayName: customer.display_name,
          gstin: customer.gst_in,
          currencyCode: customer.currency_code,
          gstTreatment: customer.gst_treatment,
          taxPreference: customer.tax_preference,
          exemptionReason: customer.exemption_reason,
          paymentTerms: JSON.parse(customer.payment_terms || '{}'),
          customerStatus: customer.customer_status,
          createdAt: customer.created_at,
          updatedAt: customer.updated_at,
        } : null;
      }
    }),

    createCustomer: builder.mutation({
      query: (newCustomer) => ({
        url: '/customers',
        method: 'POST',
        body: newCustomer,
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),

    updateCustomer: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
    }),

    importCustomers: builder.mutation({
      query: (customersToImport) => ({
        url: '/customers/import',
        method: 'POST',
        body: { customers: customersToImport },
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPaginatedCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useImportCustomersMutation,
} = customerApi;
