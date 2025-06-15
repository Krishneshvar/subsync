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
                    customers: response.customers.map(customer => {
                        // --- Handling other_contacts ---
                        let otherContactsTransformed = [];
                        // other_contacts is already a JS object/array or null/undefined
                        if (Array.isArray(customer.other_contacts)) {
                            otherContactsTransformed = customer.other_contacts;
                        } else if (customer.other_contacts && typeof customer.other_contacts === 'object') {
                            // If it's a single object (non-array), wrap it in an array
                            otherContactsTransformed = [customer.other_contacts];
                        }
                        console.log(`customerApi: Customer ID ${customer.customer_id} other_contacts (raw):`, customer.other_contacts, `transformed:`, otherContactsTransformed, `isArray:`, Array.isArray(otherContactsTransformed));
                        // For null/undefined, it remains [] from initial declaration

                        // --- Handling payment_terms ---
                        let paymentTermsTransformed = {};
                        // payment_terms is already a JS object or null/undefined
                        if (customer.payment_terms && typeof customer.payment_terms === 'object' && !Array.isArray(customer.payment_terms)) {
                            paymentTermsTransformed = customer.payment_terms;
                        }
                        // For null/undefined or array, it remains {} from initial declaration

                        // --- Handling customer_address ---
                        // customer_address is already a JS object.
                        // Ensure it's an object, default to empty object if null/undefined
                        const customerAddressTransformed = customer.customer_address && typeof customer.customer_address === 'object'
                            ? customer.customer_address
                            : {};

                        return {
                            ...customer,
                            customerId: customer.customer_id,
                            firstName: customer.first_name,
                            lastName: customer.last_name,
                            primaryEmail: customer.primary_email,
                            primaryPhoneNumber: customer.primary_phone_number,
                            secondaryPhoneNumber: customer.secondary_phone_number,
                            customerAddress: customerAddressTransformed, // Directly use the object
                            otherContacts: otherContactsTransformed, // Use the safely transformed array
                            companyName: customer.company_name,
                            displayName: customer.display_name,
                            gstin: customer.gst_in,
                            currencyCode: customer.currency_code,
                            gstTreatment: customer.gst_treatment,
                            taxPreference: customer.tax_preference,
                            exemptionReason: customer.exemption_reason,
                            paymentTerms: paymentTermsTransformed, // Use the safely transformed object
                            customerStatus: customer.customer_status,
                            createdAt: customer.created_at,
                            updatedAt: customer.updated_at,
                        };
                    }),
                    totalPages: response.totalPages,
                };
            },
        }),

        getCustomerById: builder.query({
            query: (id) => `/customers/${id}`,
            providesTags: (result, error, id) => [{ type: 'Customer', id }],
            transformResponse: (response) => {
                const customer = response.customer;
                if (!customer) return null;

                // --- Handling other_contacts ---
                let otherContactsTransformed = [];
                if (Array.isArray(customer.other_contacts)) {
                    otherContactsTransformed = customer.other_contacts;
                } else if (customer.other_contacts && typeof customer.other_contacts === 'object') {
                    otherContactsTransformed = [customer.other_contacts];
                }
                console.log(`customerApi: Fetched customer ${customer.customer_id} other_contacts (raw):`, customer.other_contacts, `transformed:`, otherContactsTransformed, `isArray:`, Array.isArray(otherContactsTransformed));

                // --- Handling payment_terms ---
                let paymentTermsTransformed = {};
                if (customer.payment_terms && typeof customer.payment_terms === 'object' && !Array.isArray(customer.payment_terms)) {
                    paymentTermsTransformed = customer.payment_terms;
                }

                // --- Handling customer_address ---
                const customerAddressTransformed = customer.customer_address && typeof customer.customer_address === 'object'
                    ? customer.customer_address
                    : {};

                return {
                    ...customer,
                    customerId: customer.customer_id,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    primaryEmail: customer.primary_email,
                    primaryPhoneNumber: customer.primary_phone_number,
                    secondaryPhoneNumber: customer.secondary_phone_number,
                    customerAddress: customerAddressTransformed, // Directly use the object
                    otherContacts: otherContactsTransformed, // Use the safely transformed array
                    companyName: customer.company_name,
                    displayName: customer.display_name,
                    gstin: customer.gst_in,
                    currencyCode: customer.currency_code,
                    gstTreatment: customer.gst_treatment,
                    taxPreference: customer.tax_preference,
                    exemptionReason: customer.exemption_reason,
                    paymentTerms: paymentTermsTransformed, // Use the safely transformed object
                    customerStatus: customer.customer_status,
                    createdAt: customer.created_at,
                    updatedAt: customer.updated_at,
                };
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
