import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import countryList from "react-select-country-list";
import axios from "axios";

import validateCustomerData from "@/features/Customers/services/inputValidator.js";
import OtherDetails from "@/features/Customers/components/OtherDetails.jsx";
import PersonalDetails from "@/features/Customers/components/PersonalDetails.jsx";
import CompanyDetails from "@/features/Customers/components/CompanyDetails.jsx";
import AddressSection from "@/features/Customers/components/AddressSection.jsx";
import ContactPersonsSection from "@/features/Customers/components/ContactPersonsSection.jsx";
import RemarksSection from "@/features/Customers/components/RemarksSection.jsx";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AddCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editableCustomerId = location.state?.editableCustomerId || null;

  const countries = countryList().getData();
  const [states, setStates] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [isEditing, setIsEditing] = useState(!!editableCustomerId);
  const [loading, setLoading] = useState(false);

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
    currencyCode: "INR",
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
    if (!editableCustomerId) return;

    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/customer/${editableCustomerId}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch customer data.");
        }

        const data = response.data.customer;
        setCustomerData({
          salutation: data.salutation,
          firstName: data.first_name,
          lastName: data.last_name,
          companyName: data.company_name,
          displayName: data.display_name,
          email: data.primary_email,
          country_code: data.country_code,
          phoneNumber: data.primary_phone_number,
          gstin: data.gst_in,
          gst_treatment: data.gst_treatment,
          tax_preference: data.tax_preference,
          exemption_reason: data.exemption_reason,
          currencyCode: { label: data.currency_code, value: data.currency_code },
          address: {
            country: data.customer_address.country || "",
            addressLine: data.customer_address.addressLine || "",
            state: data.customer_address.state || "",
            city: data.customer_address.city || "",
            zipCode: data.customer_address.zipCode || "",
          },
          notes: data.notes,
          customerStatus: data.customer_status,
        });

        setContactPersons(data.other_contacts || []);
        setLoading(false);
      } catch (error) {
        toast.error(error.message || "Failed to fetch customer data.");
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [editableCustomerId]);

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

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/update-customer/${editableCustomerId}`
        : `${import.meta.env.VITE_API_URL}/create-customer`;

      const response = await axios({
        url,
        method: isEditing ? "PUT" : "POST",
        data: payload,
      });

      if (![200, 201].includes(response.status)) {
        throw new Error("Error saving customer details.");
      }

      toast.success(isEditing ? "Customer Updated Successfully." : "Customer Created Successfully.");
      if (!isEditing) resetCustomerData();

      const userSegment = location.pathname.split("/")[1];
      setTimeout(() => navigate(`/${userSegment}/dashboard/customers`), 2000);
    } catch (error) {
      toast.error(error.message || "Error saving customer details.");
    }
  };

  if (loading) return <p>Loading customer details...</p>;

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-2">
          <TabsList>
            <TabsTrigger value="otherDetails" className="tabs-trigger-transition">Other Details</TabsTrigger>
            <TabsTrigger value="address" className="tabs-trigger-transition">Address</TabsTrigger>
            <TabsTrigger value="contactPersons" className="tabs-trigger-transition">Contact Persons</TabsTrigger>
            <TabsTrigger value="remarks" className="tabs-trigger-transition">Remarks</TabsTrigger>
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
          <Button type="submit">{isEditing ? "Update Customer" : "Save Customer"}</Button>
          <Button type="button" variant="secondary" onClick={resetCustomerData}>Reset</Button>
          <Button type="button" variant="destructive" onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
