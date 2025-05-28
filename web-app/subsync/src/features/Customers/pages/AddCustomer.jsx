import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import countryList from "react-select-country-list";
import validateCustomerData from "@/features/Customers/services/inputValidator.js";
import OtherDetails from "@/features/Customers/components/OtherDetails.jsx";
import PersonalDetails from "@/features/Customers/components/PersonalDetails.jsx";
import CompanyDetails from "@/features/Customers/components/CompanyDetails.jsx";
import AddressSection from "@/features/Customers/components/AddressSection.jsx";
import ContactPersonsSection from "@/features/Customers/components/ContactPersonsSection.jsx";
import RemarksSection from "@/features/Customers/components/RemarksSection.jsx";
import { createCustomer, updateCustomer, fetchCustomerById, clearCustomerState } from "@/features/Customers/customerSlice.js";
import { Button } from "@/components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { useDispatch, useSelector } from "react-redux";

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

  const [customerData, setCustomerData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    country_code: "+91",
    phoneNumber: "",
    gstin: "",
    gst_treatment: "",
    tax_preference: "",
    exemption_reason: "",
    currencyCode: { label: "INR", value: "INR" },
    address: {
      country: { label: "India", value: "IN" },
      addressLine: "",
      state: null,
      city: "",
      zipCode: "",
    },
    notes: "",
    customerStatus: "Active",
  });

  const resetCustomerData = () => {
    setCustomerData({
      salutation: "",
      firstName: "",
      lastName: "",
      companyName: "",
      displayName: "",
      email: "",
      country_code: "+91",
      phoneNumber: "",
      gstin: "",
      gst_treatment: "",
      tax_preference: "",
      exemption_reason: "",
      currencyCode: { label: "INR", value: "INR" },
      address: {
        country: { label: "India", value: "IN" },
        addressLine: "",
        state: null,
        city: "",
        zipCode: "",
      },
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
        notes: currentCustomer.notes,
        customerStatus: currentCustomer.customer_status,
      });
      setContactPersons(currentCustomer.other_contacts || []);
    }
  }, [currentCustomer, isEditing]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateCustomerData(customerData);

      const payload = {
        ...customerData,
        currencyCode: customerData.currencyCode?.value || "INR",
        address: {
            ...customerData.address,
            country: customerData.address.country?.value || "IN",
            state: customerData.address.state?.value || "",
        },
        contactPersons: contactPersons.map((person) => ({
          salutation: person.salutation,
          designation: person.designation,
          first_name: person.first_name,
          last_name: person.last_name,
          email: person.email,
          phone_number: person.phone_number,
          country_code: person.country_code,
        })),
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
      toast.error(err.message || "Error saving customer details.");
    }
  };

  if (loading) return <p>Loading customer details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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
