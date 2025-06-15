import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import countryList from "react-select-country-list";

import { Button } from "@/components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";

import AddressSection from "../components/AddressSection.jsx";
import CompanyDetails from "../components/CompanyDetails.jsx";
import ContactPersonsSection from "../components/ContactPersonsSection.jsx";
import OtherDetails from "../components/OtherDetails.jsx";
import PersonalDetails from "../components/PersonalDetails.jsx";
import RemarksSection from "../components/RemarksSection.jsx";

import PaymentTermsSection from '@/features/PaymentTerms/components/PaymentTermsSection.jsx';
import { validateCustomerData } from "@/features/Customers/services/inputValidator.js";
import { indianStates } from "@/features/Customers/data/statesOfIndia.js";
import {
    useCreateCustomerMutation,
    useGetCustomerByIdQuery,
    useUpdateCustomerMutation,
} from "@/features/Customers/customerApi.js";

const AddCustomer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const editableCustomerId = location.state?.editableCustomerId ?? null;
    const {
        data: customerToEdit,
        isLoading: isFetchingCustomer,
        isError: fetchError,
        error: fetchErrorObject,
    } = useGetCustomerByIdQuery(editableCustomerId, { skip: !editableCustomerId });

    const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

    const loading = isFetchingCustomer || isCreating || isUpdating;

    const countries = useMemo(() => countryList().getData(), []);
    const allIndianStates = useMemo(() => indianStates, []);

    const initialCustomerData = {
        salutation: { label: "Mr.", value: "Mr." },
        firstName: "",
        lastName: "",
        companyName: "",
        displayName: "",
        email: "",
        phoneNumber: "",
        secondaryPhoneNumber: "",
        gstin: "",
        gst_treatment: "iGST",
        tax_preference: "Taxable",
        exemption_reason: "",
        currencyCode: "INR",
        address: {
            country: { label: "India", value: "IN" },
            addressLine: "",
            state: null,
            city: "",
            zipCode: "",
        },
        payment_terms: { term_name: "Due on Receipt", days: 0, is_default: true }, // Ensure this is an object by default
        notes: "",
        customerStatus: "Active",
    };

    const [states, setStates] = useState([]);
    // Ensure contactPersons is always initialized as an array.
    // The useEffect will update it if data is fetched.
    const [contactPersons, setContactPersons] = useState([]);
    const [activeTab, setActiveTab] = useState("otherDetails");
    const [isEditing, setIsEditing] = useState(!!editableCustomerId);
    const [formErrors, setFormErrors] = useState({});

    const [customerData, setCustomerData] = useState(initialCustomerData);

    const resetCustomerData = () => {
        setCustomerData(initialCustomerData);
        setContactPersons([]); // Ensure contactPersons is reset to empty array
        setFormErrors({});
        setIsEditing(false); // Reset editing status for new customer
    };

    const handleCancel = () => {
        const currentPath = location.pathname;
        const userSegment = currentPath.split("/")[1];
        navigate(`/${userSegment}/dashboard/customers`);
    };

    const handleStatusChange = (status) => {
        setCustomerData((prevData) => ({
            ...prevData,
            customerStatus: status,
        }));
    };

    useEffect(() => {
        // This effect runs on mount and whenever editableCustomerId or customerToEdit changes.
        // It's crucial to handle the initial loading state correctly.

        if (editableCustomerId && customerToEdit) {
            // Data has loaded for an existing customer
            setIsEditing(true);

            const mappedAddressCountry = countries.find(
                (country) => country.value === (customerToEdit.customerAddress?.country || "IN")
            ) || { label: "India", value: "IN" };

            const mappedAddressState =
                (mappedAddressCountry.value === "IN" && allIndianStates.find(
                    (state) => state.value === (customerToEdit.customerAddress?.state || "")
                )) || null;

            const mappedSalutation = {
                label: customerToEdit.salutation || "Mr.",
                value: customerToEdit.salutation || "Mr.",
            };

            setCustomerData({
                salutation: mappedSalutation,
                firstName: customerToEdit.firstName || "",
                lastName: customerToEdit.lastName || "",
                companyName: customerToEdit.companyName || "",
                displayName: customerToEdit.displayName || "",
                email: customerToEdit.primaryEmail || "",
                phoneNumber: customerToEdit.primaryPhoneNumber || "",
                secondaryPhoneNumber: customerToEdit.secondaryPhoneNumber || "",
                gstin: customerToEdit.gstin || "",
                gst_treatment: customerToEdit.gstTreatment || "iGST",
                tax_preference: customerToEdit.taxPreference || "Taxable",
                exemption_reason: customerToEdit.exemptionReason || "",
                currencyCode: customerToEdit.currencyCode || "INR",
                address: {
                    country: mappedAddressCountry,
                    addressLine: customerToEdit.customerAddress?.addressLine || "",
                    state: mappedAddressState,
                    city: customerToEdit.customerAddress?.city || "",
                    zipCode: customerToEdit.customerAddress?.zipCode || "",
                },
                // Ensure payment_terms is an object, merging with default if needed
                payment_terms: {
                    ...initialCustomerData.payment_terms, // Start with default structure
                    ...(customerToEdit.paymentTerms || {}), // Overlay with fetched data
                },
                notes: customerToEdit.notes || "",
                customerStatus: customerToEdit.customerStatus || "Active",
            });

            // This is the most crucial part: defensive check before mapping
            const otherContactsFromApi = customerToEdit.otherContacts;
            if (Array.isArray(otherContactsFromApi)) {
                setContactPersons(
                    otherContactsFromApi.map((person) => ({
                        ...person, // Spread existing properties
                        id: person.contactPersonId || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        salutation: person.salutation || "Mr.",
                        designation: person.designation || "",
                        firstName: person.firstName || "",
                        lastName: person.lastName || "",
                        email: person.email || "",
                        phoneNumber: person.phoneNumber || "",
                        countryCode: person.countryCode || "+91",
                    }))
                );
            } else {
                // If otherContactsFromApi is not an array (e.g., null, undefined, or an unexpected type)
                // then initialize contactPersons as an empty array to prevent map errors.
                console.warn("customerToEdit.otherContacts is not an array:", otherContactsFromApi);
                setContactPersons([]);
            }

            if (mappedAddressCountry.value === "IN") {
                setStates(allIndianStates);
            } else {
                setStates([]);
            }
        } else if (!editableCustomerId) {
            // If we are definitely in "add" mode (no editableCustomerId)
            // and `isEditing` was somehow true (e.g., came from an edit page, then navigated to add)
            // or if we just want to ensure clean state for "add" mode
            resetCustomerData();
        }
        // Depend on customerToEdit, editableCustomerId, and isFetchingCustomer to ensure correct re-runs
        // isFetchingCustomer ensures we don't try to process customerToEdit when it's still loading.
    }, [editableCustomerId, customerToEdit, countries, allIndianStates, isFetchingCustomer]);


    useEffect(() => {
        if (customerData.address.country?.value === "IN") {
            setStates(allIndianStates);
        } else {
            setStates([]);
        }
    }, [customerData.address.country, allIndianStates]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split(".");

        setCustomerData((prevData) => {
            if (keys.length > 1) {
                return {
                    ...prevData,
                    [keys[0]]: {
                        ...prevData[keys[0]],
                        [keys[1]]: value,
                    },
                };
            } else {
                return {
                    ...prevData,
                    [name]: value,
                };
            }
        });
    };

    const handleSelectChange = (field, selectedValue) => {
        const keys = field.split(".");

        setCustomerData((prevData) => {
            let newData = { ...prevData };

            if (keys.length > 1) {
                newData[keys[0]] = {
                    ...prevData[keys[0]],
                    [keys[1]]: selectedValue,
                };
            } else {
                newData[field] = selectedValue;
            }
            return newData;
        });
    };

    const handlePhoneNumberChange = (value, type = 'primary') => {
        setCustomerData(prevData => ({
            ...prevData,
            [type === 'primary' ? 'phoneNumber' : 'secondaryPhoneNumber']: value || "",
        }));
    };

    const handlePaymentTermChange = (term) => {
        setCustomerData(prev => ({
            ...prev,
            payment_terms: term
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        const validationErrors = validateCustomerData(customerData);

        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            toast.error("Please correct the highlighted errors.");
            const firstErrorField = Object.keys(validationErrors)[0];
            document.querySelector(`[name="${firstErrorField}"]`)?.focus();
            return;
        }

        try {
            // Ensure contactPersons is always an array before mapping for payload
            const contactPersonsPayload = Array.isArray(contactPersons) ? contactPersons.map((person) => {
                const { id, ...rest } = person;
                return {
                    ...(typeof id === 'number' ? { contact_person_id: id } : {}),
                    salutation: rest.salutation || "",
                    designation: rest.designation || "",
                    first_name: rest.firstName || "",
                    last_name: rest.lastName || "",
                    email: rest.email || "",
                    phone_number: rest.phoneNumber || "",
                    country_code: rest.countryCode || "",
                };
            }) : [];


            const payload = {
                salutation: customerData.salutation?.value || "Mr.",
                first_name: customerData.firstName || "",
                last_name: customerData.lastName || "",
                primary_email: customerData.email || "",
                primary_phone_number: customerData.phoneNumber || "",
                secondary_phone_number: customerData.secondaryPhoneNumber || "",
                company_name: customerData.companyName || "",
                display_name: customerData.displayName || "",
                gst_in: customerData.gstin || "",
                currency_code: customerData.currencyCode || "INR",
                gst_treatment: customerData.gst_treatment || "iGST",
                tax_preference: customerData.tax_preference || "Taxable",
                exemption_reason: customerData.exemption_reason || "",
                customer_address: {
                    addressLine: customerData.address.addressLine || "",
                    city: customerData.address.city || "",
                    state: customerData.address.state?.value || "",
                    country: customerData.address.country?.value || "IN",
                    zipCode: customerData.address.zipCode || ""
                },
                other_contacts: contactPersonsPayload, // Use the safely transformed array
                payment_terms: customerData.payment_terms || { term_name: "Due on Receipt", days: 0, is_default: true },
                notes: customerData.notes || "",
                customer_status: customerData.customerStatus || "Active"
            };

            let result;
            if (isEditing) {
                result = await updateCustomer({ id: editableCustomerId, ...payload }).unwrap();
            } else {
                result = await createCustomer(payload).unwrap();
            }

            toast.success(result.message || (isEditing ? "Customer Updated Successfully." : "Customer Created Successfully."));
            if (!isEditing) resetCustomerData();

            const userSegment = location.pathname.split("/")[1];
            navigate(`/${userSegment}/dashboard/customers`);
        } catch (err) {
            console.error("Submission error:", err);
            const errorMessage = err?.data?.message || err?.message || 'An unexpected error occurred during submission.';
            toast.error(errorMessage);
        }
    };

    if (isFetchingCustomer) {
        return <p className="container mt-4">Loading customer details...</p>;
    }

    if (fetchError) {
        const errorMessage = fetchErrorObject?.data?.message || fetchErrorObject?.message || 'An unknown error occurred while fetching customer details.';
        return <p className="container mt-4 text-red-500">Error: {errorMessage}</p>;
    }

    return (
        <div className="container mt-4">
            <ToastContainer position="top-center" autoClose={2000} theme="dark" transition={Bounce} pauseOnHover />
            <h1 className="mb-4 text-3xl font-bold ">{isEditing ? "Edit Customer" : "Add Customer"}</h1>
            <hr className="mb-4 border-blue-500 border-3 size-auto" />

            <form onSubmit={handleSubmit} className="space-y-6">
                <PersonalDetails
                    customerData={customerData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    handlePhoneNumberChange={handlePhoneNumberChange}
                    handleStatusChange={handleStatusChange}
                    errors={formErrors}
                />
                <CompanyDetails
                    customerData={customerData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    errors={formErrors}
                />

                <hr className="mb-4 border-gray-500 border-1 size-auto" />

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-2">
                    <TabsList className="flex flex-wrap justify-start w-fit border-1 border-gray-300 bg-gray-200 mb-4 gap-2">
                        <TabsTrigger
                            value="otherDetails"
                            className="tabs-trigger-transition transition-colors duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                            Other Details
                        </TabsTrigger>
                        <TabsTrigger
                            value="address"
                            className="tabs-trigger-transition transition-colors duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                            Address
                        </TabsTrigger>
                        <TabsTrigger
                            value="contactPersons"
                            className="tabs-trigger-transition transition-colors duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                            Contact Persons
                        </TabsTrigger>
                        <TabsTrigger
                            value="remarks"
                            className="tabs-trigger-transition transition-colors duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                            Remarks
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="otherDetails" className="tabs-content-transition">
                        <OtherDetails
                            customerData={customerData}
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}
                            errors={formErrors}
                        />
                        <PaymentTermsSection
                            selectedTerm={customerData.payment_terms}
                            onTermChange={handlePaymentTermChange}
                            errors={formErrors}
                        />
                    </TabsContent>

                    <TabsContent value="address" className="tabs-content-transition">
                        <AddressSection
                            customerData={customerData}
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}
                            countries={countries}
                            states={states}
                            setStates={setStates}
                            errors={formErrors}
                        />
                    </TabsContent>

                    <TabsContent value="contactPersons" className="tabs-content-transition">
                      {console.log("AddCustomer: contactPersons prop being passed:", contactPersons, "Type:", typeof contactPersons, "Is Array:", Array.isArray(contactPersons))}
                        <ContactPersonsSection
                            contactPersons={contactPersons} // This is guaranteed to be an array due to useState([]) and the useEffect logic
                            setContactPersons={setContactPersons}
                            errors={formErrors}
                        />
                    </TabsContent>

                    <TabsContent value="remarks" className="tabs-content-transition">
                        <RemarksSection
                            customerData={customerData}
                            handleInputChange={handleInputChange}
                            errors={formErrors}
                        />
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 mt-4">
                    <Button type="submit" disabled={loading}>
                        {isEditing ? "Update" : "Save"}
                    </Button>
                    <Button type="button" className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={resetCustomerData} disabled={loading}>
                        Reset
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddCustomer;
