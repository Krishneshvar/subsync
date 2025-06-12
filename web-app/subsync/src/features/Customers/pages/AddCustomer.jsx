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

  // data fetching and mutations
  const editableCustomerId = location.state?.editableCustomerId || null;
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

  const [states, setStates] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [isEditing, setIsEditing] = useState(!!editableCustomerId);
  const [formErrors, setFormErrors] = useState({});

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
    payment_terms: null,
    notes: "",
    customerStatus: "Active",
  };

  const [customerData, setCustomerData] = useState(initialCustomerData);

  const resetCustomerData = () => {
    setCustomerData(initialCustomerData);
    setContactPersons([]);
    setFormErrors({});
    setIsEditing(false);
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
    if (editableCustomerId && customerToEdit) {
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
        payment_terms: customerToEdit.paymentTerms || null,
        notes: customerToEdit.notes || "",
        customerStatus: customerToEdit.customerStatus || "Active",
      });

      setContactPersons(
        customerToEdit.otherContacts.map((person) => ({
          ...person,
          id: person.contactPersonId || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          salutation: person.salutation,
          designation: person.designation,
          firstName: person.firstName,
          lastName: person.lastName,
          email: person.email,
          phoneNumber: person.phoneNumber,
          countryCode: person.countryCode,
        })) || []
      );

      if (mappedAddressCountry.value === "IN") {
        setStates(allIndianStates);
      } else {
        setStates([]);
      }
    } else if (!editableCustomerId && isEditing) {
      resetCustomerData();
    }
  }, [editableCustomerId, customerToEdit, countries, allIndianStates]);

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
      // set focus to the first field with error
      const firstErrorField = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    try {
      const contactPersonsPayload = contactPersons.map((person) => {
        const { id, ...rest } = person;
        return {
          ...(typeof id === 'number' ? { contact_person_id: id } : {}),
          salutation: rest.salutation || "",
          designation: rest.designation || "",
          first_name: rest.firstName || "",
          last_name: rest.lastName || "",
          email: rest.email || "",
          phone_number: rest.phoneNumber || "",
        };
      });

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
        other_contacts: contactPersonsPayload,
        payment_terms: customerData.payment_terms || { term_name: "Due on Receipt", days: 0, is_default: true },
        notes: customerData.notes || "",
        customer_status: customerData.customerStatus || "Active"
      };

      let result;
      if (isEditing) {
        result = await updateCustomer({ id: editableCustomerId, ...payload }).unwrap(); // .unwrap() to throw error on rejection
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
            <ContactPersonsSection
              contactPersons={contactPersons}
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
