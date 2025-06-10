import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useState, useEffect, useMemo, useRef } from "react"; // Added useRef for phone input consistency

import { Button } from "@/components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";

import AddressSection from "../components/AddressSection.jsx";
import CompanyDetails from "../components/CompanyDetails.jsx";
import ContactPersonsSection from "../components/ContactPersonsSection.jsx";
import OtherDetails from "../components/OtherDetails.jsx";
import PaymentTermsSection from '../components/PaymentTermsSection';
import PersonalDetails from "../components/PersonalDetails.jsx";
import RemarksSection from "../components/RemarksSection.jsx";

import { createCustomer, updateCustomer, fetchCustomerById, clearCustomerState } from "@/features/Customers/customerSlice.js";
import { validateCustomerData } from "@/features/Customers/services/inputValidator.js";
import { indianStates } from "@/features/Customers/data/statesOfIndia.js";

const AddCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentCustomer, loading, error } = useSelector((state) => state.customers);
  const editableCustomerId = location.state?.editableCustomerId || null;

  const countries = useMemo(() => countryList().getData(), []);
  // Memoize indianStates too
  const allIndianStates = useMemo(() => indianStates, []);

  const [states, setStates] = useState([]); // This state is for AddressSection, probably
  const [contactPersons, setContactPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [isEditing, setIsEditing] = useState(!!editableCustomerId);

  // Initialize all select-related fields to their expected object/string structure
  const [customerData, setCustomerData] = useState({
    salutation: { label: "Mr.", value: "Mr." }, // Object for react-select
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    country_code: "+91",
    phoneNumber: "",
    secondaryPhoneNumber: "",
    gstin: "",
    gst_treatment: "iGST", // String for Shadcn Select
    tax_preference: "Taxable", // String for Shadcn Select
    exemption_reason: "",
    currencyCode: "INR", // String for Shadcn Select
    address: {
      country: { label: "India", value: "IN" }, // Object for react-select
      addressLine: "",
      state: null, // Object for react-select, will be set on country change
      city: "",
      zipCode: "",
    },
    payment_terms: null,
    notes: "",
    customerStatus: "Active",
  });

  const resetCustomerData = () => {
    setCustomerData({
      salutation: { label: "Mr.", value: "Mr." },
      firstName: "",
      lastName: "",
      companyName: "",
      displayName: "",
      email: "",
      country_code: "+91",
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
    });
    setContactPersons([]);
    dispatch(clearCustomerState());
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
    if (editableCustomerId) {
      dispatch(fetchCustomerById(editableCustomerId));
    }
    // Cleanup function: Clear customer state when component unmounts OR when switching from edit to add
    return () => {
      // Only clear if we are not actively in an edit session after unmount
      // Or if editableCustomerId changes from a value to null (meaning going from edit to add)
      if (!location.state?.editableCustomerId && editableCustomerId) {
         dispatch(clearCustomerState());
      }
    };
  }, [editableCustomerId, dispatch, location.state?.editableCustomerId]);

  useEffect(() => {
    if (currentCustomer && isEditing) {
      // Map currency code to object if it's a string from backend
      const mappedCurrencyCode = {
        label: currentCustomer.currency_code || "INR",
        value: currentCustomer.currency_code || "INR"
      };

      // Map address country to object
      const mappedAddressCountry = countries.find(
        (country) => country.value === (currentCustomer.customer_address?.country || "IN")
      ) || { label: "India", value: "IN" };

      // Map address state to object
      const mappedAddressState = allIndianStates.find(
        (state) => state.value === (currentCustomer.customer_address?.state || "")
      ) || null;

      // Map salutation to object
      const mappedSalutation = {
        label: currentCustomer.salutation || "Mr.",
        value: currentCustomer.salutation || "Mr."
      };


      setCustomerData({
        salutation: mappedSalutation, // Now an object
        firstName: currentCustomer.first_name || "",
        lastName: currentCustomer.last_name || "",
        companyName: currentCustomer.company_name || "",
        displayName: currentCustomer.display_name || "",
        email: currentCustomer.primary_email || "",
        country_code: currentCustomer.country_code || "+91",
        phoneNumber: currentCustomer.primary_phone_number || "",
        secondaryPhoneNumber: currentCustomer.secondary_phone_number || "",
        gstin: currentCustomer.gst_in || "",
        gst_treatment: currentCustomer.gst_treatment || "iGST",
        tax_preference: currentCustomer.tax_preference || "Taxable",
        exemption_reason: currentCustomer.exemption_reason || "",
        currencyCode: currentCustomer.currency_code || "INR", // Keep as string for Shadcn Select
        address: {
          country: mappedAddressCountry, // Now an object
          addressLine: currentCustomer.customer_address?.addressLine || "",
          state: mappedAddressState, // Now an object
          city: currentCustomer.customer_address?.city || "",
          zipCode: currentCustomer.customer_address?.zipCode || "",
        },
        payment_terms: currentCustomer.payment_terms || null,
        notes: currentCustomer.notes || "",
        customerStatus: currentCustomer.customer_status || "Active",
      });

      setContactPersons(currentCustomer.other_contacts.map(person => ({
        ...person,
        id: person.contact_person_id || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      })) || []);

      // If the loaded customer's country is India, set the states for the AddressSection
      if (mappedAddressCountry.value === "IN") {
        setStates(allIndianStates);
      } else {
        setStates([]);
      }

    } else if (!editableCustomerId && currentCustomer) {
        // This means currentCustomer was loaded (e.g., from a previous edit session)
        // but we are in add mode, so clear it.
        resetCustomerData();
    }
  }, [currentCustomer, isEditing, editableCustomerId, countries, allIndianStates]);

  // This effect handles setting available states for AddressSection dynamically
  useEffect(() => {
    if (customerData.address.country?.value === "IN") { // Check .value as it's an object now
        setStates(allIndianStates);
    } else {
        setStates([]);
    }
  }, [customerData.address.country, allIndianStates]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      setCustomerData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setCustomerData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Unified handleSelectChange:
  // For react-select (e.g., country, state, salutation), 'value' will be an object {label, value}
  // For Shadcn Select (e.g., currencyCode, gst_treatment), 'value' will be a string
  const handleSelectChange = (field, selectedValue) => {
    const keys = field.split(".");

    setCustomerData((prevData) => {
      let newData = { ...prevData };

      if (keys.length > 1) {
        // Nested field (e.g., address.country, address.state)
        newData[keys[0]] = {
          ...prevData[keys[0]],
          [keys[1]]: selectedValue, // Store the full object or string as provided
        };
      } else {
        // Top-level field (e.g., currencyCode, gst_treatment, salutation)
        newData[field] = selectedValue; // Store the full object or string as provided
      }
      return newData;
    });
  };

  const handlePaymentTermChange = (term) => {
    setCustomerData(prev => ({
      ...prev,
      payment_terms: term
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateCustomerData(customerData);

      const contactPersonsPayload = contactPersons.map((person) => {
        const { id, ...rest } = person;
        return {
          ...(typeof id === 'number' ? { contact_person_id: id } : {}),
          salutation: rest.salutation || "",
          designation: rest.designation || "",
          first_name: rest.first_name || "",
          last_name: rest.last_name || "",
          email: rest.email || "",
          phone_number: rest.phone_number || "",
          country_code: rest.country_code || "+91"
        };
      });

      const payload = {
        salutation: customerData.salutation?.value || "Mr.", // Extract value from object
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        email: customerData.email || "",
        country_code: customerData.country_code || "+91",
        phoneNumber: customerData.phoneNumber || "",
        secondaryPhoneNumber: customerData.secondaryPhoneNumber || "",
        companyName: customerData.companyName || "",
        displayName: customerData.displayName || "",
        gstin: customerData.gstin || "",
        currencyCode: customerData.currencyCode || "INR", // Already a string
        gst_treatment: customerData.gst_treatment || "iGST", // Already a string
        tax_preference: customerData.tax_preference || "Taxable", // Already a string
        exemption_reason: customerData.exemption_reason || "",
        address: {
          ...customerData.address,
          country: customerData.address.country?.value || "IN", // Extract value from object
          state: customerData.address.state?.value || "", // Extract value from object
          addressLine: customerData.address.addressLine || "",
          city: customerData.address.city || "",
          zipCode: customerData.address.zipCode || ""
        },
        contactPersons: contactPersonsPayload,
        payment_terms: customerData.payment_terms || { term_name: "Due on Receipt", days: 0, is_default: true },
        notes: customerData.notes || "",
        customerStatus: customerData.customerStatus || "Active"
      };

      let actionResult;
      if (isEditing) {
        actionResult = await dispatch(updateCustomer({ id: editableCustomerId, payload }));
      } else {
        actionResult = await dispatch(createCustomer(payload));
      }

      if (actionResult.meta.requestStatus === "rejected") {
        throw new Error(actionResult.payload || "Error saving customer details.");
      }

      toast.success(isEditing ? "Customer Updated Successfully." : "Customer Created Successfully.");
      if (!isEditing) resetCustomerData();

      const userSegment = location.pathname.split("/")[1];
      setTimeout(() => navigate(`/${userSegment}/dashboard/customers`), 2000);
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'An error occurred';
      toast.error(errorMessage);
      console.error("Submission error:", err);
    }
  };

  if (loading) return <p>Loading customer details...</p>;
  if (error) return <p className="text-red-500">Error: {typeof error === 'string' ? error : error?.message || 'An unknown error occurred'}</p>;


  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" autoClose={2000} theme="dark" transition={Bounce} pauseOnHover />
      <h1 className="mb-4 text-3xl font-bold ">{isEditing ? "Edit Customer" : "Add Customer"}</h1>
      <hr className="mb-4 border-blue-500 border-3 size-auto" />

      <form onSubmit={handleSubmit}>
        <PersonalDetails
          customerData={customerData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleStatusChange={handleStatusChange}
        />
        <CompanyDetails
          customerData={customerData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
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
            />
            <PaymentTermsSection
              selectedTerm={customerData.payment_terms}
              onTermChange={handlePaymentTermChange}
            />
          </TabsContent>

          <TabsContent value="address" className="tabs-content-transition">
            <AddressSection
              customerData={customerData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              countries={countries}
              states={states} // states for react-select in AddressSection
              setStates={setStates} // setStates for react-select in AddressSection
            />
          </TabsContent>

          <TabsContent value="contactPersons" className="tabs-content-transition">
            <ContactPersonsSection
              contactPersons={contactPersons}
              setContactPersons={setContactPersons}
            />
          </TabsContent>

          <TabsContent value="remarks" className="tabs-content-transition">
            <RemarksSection
              customerData={customerData}
              handleInputChange={handleInputChange}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="submit" disabled={loading}>{isEditing ? "Update" : "Save"}</Button>
          <Button type="button" className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={resetCustomerData} disabled={loading}>Reset</Button>
          <Button type="button" variant="destructive" onClick={handleCancel} disabled={loading}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
