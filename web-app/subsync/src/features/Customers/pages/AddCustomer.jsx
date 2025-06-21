import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";

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

  const countries = countryList().getData();
  const [states, setStates] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [isEditing, setIsEditing] = useState(!!editableCustomerId);
  const [paymentTermsList, setPaymentTermsList] = useState([]);

  const [customerData, setCustomerData] = useState({
    salutation: "Mr.",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    country_code: "+91",
    phoneNumber: "",
    secondaryPhoneNumber: "",
    gstin: "",
    gst_treatment: "CGST & SGST",
    tax_preference: "Taxable",
    exemption_reason: "",
    currencyCode: "INR",
    address: {
      country: "IN",
      addressLine: "",
      state: null,
      city: "",
      zipCode: "",
    },
    payment_terms: null,
    notes: "",
    customerStatus: "Active",
  });

  const resetCustomerData = () => {
    setCustomerData({
      salutation: "Mr.",
      firstName: "",
      lastName: "",
      companyName: "",
      displayName: "",
      email: "",
      country_code: "+91",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      gstin: "",
      gst_treatment: "CGST & SGST",
      tax_preference: "Taxable",
      exemption_reason: "",
      currencyCode: { label: "INR", value: "INR" },
      address: {
        country: "IN",
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
    return () => {
      dispatch(clearCustomerState()); // Clear current customer data when component unmounts
    };
  }, [editableCustomerId, dispatch]);

  useEffect(() => {
  // Fetch payment terms for matching
  const fetchTerms = async () => {
    try {
      const response = await api.get('/payment-terms');
      setPaymentTermsList(response.data || []);
    } catch (e) {
      setPaymentTermsList([]);
    }
  };
  fetchTerms();
  }, []);

  useEffect(() => {
  if (currentCustomer && isEditing && paymentTermsList.length > 0) {
    // Find the matching term object from the list
    const matchedTerm = paymentTermsList.find(
      t => t.term_name === currentCustomer.payment_terms?.term_name
    );
    setCustomerData(prev => ({
      ...prev,
      payment_terms: matchedTerm || currentCustomer.payment_terms,
    }));
  }

  }, [currentCustomer, isEditing, paymentTermsList.length]);

  useEffect(() => {
    if (currentCustomer && isEditing) {
      setCustomerData({
        salutation: currentCustomer.salutation,
        firstName: currentCustomer.first_name,
        lastName: currentCustomer.last_name,
        companyName: currentCustomer.company_name,
        displayName: currentCustomer.display_name,
        email: currentCustomer.primary_email,
        country_code: currentCustomer.country_code,
        phoneNumber: currentCustomer.primary_phone_number,
        secondaryPhoneNumber: currentCustomer.secondary_phone_number,
        gstin: currentCustomer.gst_in,
        gst_treatment: currentCustomer.gst_treatment,
        tax_preference: currentCustomer.tax_preference,
        exemption_reason: currentCustomer.exemption_reason,
        currencyCode: currentCustomer.currency_code?.value || currentCustomer.currency_code || "",
        address: {
          country: currentCustomer.customer_address.country?.value || currentCustomer.customer_address.country || "",
          addressLine: currentCustomer.customer_address?.addressLine || "",
          state: currentCustomer.customer_address.state?.value || currentCustomer.customer_address.state || "",
          city: currentCustomer.customer_address?.city || "",
          zipCode: currentCustomer.customer_address?.zipCode || "",
        },
        payment_terms: currentCustomer.payment_terms,
        notes: currentCustomer.notes,
        customerStatus: currentCustomer.customer_status,
      });
      setContactPersons(currentCustomer.other_contacts || []);
    }
  }, [currentCustomer, isEditing]);

  

  useEffect(() => {
    if (!customerData.address.state) {
      setStates(indianStates);
    }
  }, []);

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

  const handleSelectChange = (field, value) => {
    const keys = field.split(".");
    if (keys.length > 1) {
      setCustomerData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value?.value || "",
        },
      }));
    } else {
      setCustomerData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
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
      const payload = {
        salutation: customerData.salutation,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        country_code: customerData.country_code,
        phoneNumber: customerData.phoneNumber,
        secondaryPhoneNumber: customerData.secondaryPhoneNumber,
        companyName: customerData.companyName,
        displayName: customerData.displayName,
        gstin: customerData.gstin,
        currencyCode: customerData.currencyCode?.value || customerData.currencyCode || "INR",
        gst_treatment: customerData.gst_treatment,
        tax_preference: customerData.tax_preference,
        exemption_reason: customerData.exemption_reason || "",
        address: {
          ...customerData.address,
          country: customerData.address.country?.value || customerData.address.country || "IN",
          state: customerData.address.state?.value || customerData.address.state || "",
          addressLine: customerData.address.addressLine || "",
          city: customerData.address.city || "",
          zipCode: customerData.address.zipCode || ""
        },
        contactPersons: contactPersons.map((person) => ({
          salutation: person.salutation || "",
          designation: person.designation || "",
          first_name: person.first_name || "",
          last_name: person.last_name || "",
          email: person.email || "",
          phone_number: person.phone_number || "",
          country_code: person.country_code || "+91"
        })),
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
    }
  };

  if (loading) return <p>Loading customer details...</p>;
  if (error) return <p className="text-red-500">Error: {typeof error === 'string' ? error : error.message || 'An error occurred'}</p>;

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
              states={states}
              setStates={setStates}
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
