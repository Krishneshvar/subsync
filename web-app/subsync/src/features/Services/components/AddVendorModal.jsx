import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import countryList from "react-select-country-list";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AddressSection from "@/features/Customers/components/AddressSection";
import CompanyDetails from "@/features/Customers/components/CompanyDetails";
import ContactPersonsSection from "@/features/Customers/components/ContactPersonsSection";
import OtherDetails from "@/features/Customers/components/OtherDetails";
import PaymentTermsSection from '@/features/Customers/components/PaymentTermsSection';
import PersonalDetails from "@/features/Customers/components/PersonalDetails";
import RemarksSection from "@/features/Customers/components/RemarksSection";

import { createVendor, updateVendor } from "@/features/Services/vendorSlice";

const AddVendorModal = ({ isEditing = false, editableVendor = null, onVendorAdded }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [contactPersons, setContactPersons] = useState([]);
  const [states, setStates] = useState([]);

  const countries = countryList().getData();

  const [vendorData, setVendorData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    country_code: "+91",
    phoneNumber: "",
    secondaryPhoneNumber: "",
    gstin: "",
    gst_treatment: "",
    tax_preference: "Taxable",
    exemption_reason: "",
    currencyCode: { label: "INR", value: "INR" },
    address: {
      country: { label: "India", value: "IN" },
      addressLine: "",
      state: null,
      city: "",
      zipCode: "",
    },
    payment_terms: null,
    notes: "",
    vendorStatus: "Active",
  });

  const resetVendorData = () => {
    setVendorData({
      salutation: "",
      firstName: "",
      lastName: "",
      companyName: "",
      displayName: "",
      email: "",
      country_code: "+91",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      gstin: "",
      gst_treatment: "",
      tax_preference: "Taxable",
      exemption_reason: "",
      currencyCode: { label: "INR", value: "INR" },
      address: {
        country: { label: "India", value: "IN" },
        addressLine: "",
        state: null,
        city: "",
        zipCode: "",
      },
      payment_terms: null,
      notes: "",
      vendorStatus: "Active",
    });
    setContactPersons([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      setVendorData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setVendorData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (field, value) => {
    const keys = field.split(".");
    if (keys.length > 1) {
      setVendorData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value?.value || "",
        },
      }));
    } else {
      setVendorData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  const handlePaymentTermChange = (term) => {
    setVendorData(prev => ({
      ...prev,
      payment_terms: term
    }));
  };

  const handleStatusChange = (status) => {
    setVendorData((prevData) => ({
      ...prevData,
      vendorStatus: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        salutation: vendorData.salutation,
        firstName: vendorData.firstName,
        lastName: vendorData.lastName,
        email: vendorData.email,
        country_code: vendorData.country_code,
        phoneNumber: vendorData.phoneNumber,
        secondaryPhoneNumber: vendorData.secondaryPhoneNumber,
        companyName: vendorData.companyName,
        displayName: vendorData.displayName,
        gstin: vendorData.gstin,
        currencyCode: vendorData.currencyCode?.value || vendorData.currencyCode || "INR",
        gst_treatment: vendorData.gst_treatment,
        tax_preference: vendorData.tax_preference,
        exemption_reason: vendorData.exemption_reason || "",
        address: {
          ...vendorData.address,
          country: vendorData.address.country?.value || vendorData.address.country || "IN",
          state: vendorData.address.state?.value || vendorData.address.state || "",
          addressLine: vendorData.address.addressLine || "",
          city: vendorData.address.city || "",
          zipCode: vendorData.address.zipCode || ""
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
        payment_terms: vendorData.payment_terms || { term_name: "Due on Receipt", days: 0, is_default: true },
        notes: vendorData.notes || "",
        vendorStatus: vendorData.vendorStatus || "Active"
      };

      let actionResult;
      if (isEditing) {
        actionResult = await dispatch(updateVendor({ id: editableVendor.vendor_id, ...payload }));
      } else {
        actionResult = await dispatch(createVendor(payload));
      }

      if (actionResult.meta.requestStatus === "rejected") {
        throw new Error(actionResult.payload || "Error saving vendor details.");
      }

      toast.success(isEditing ? "Vendor Updated Successfully." : "Vendor Created Successfully.");
      if (!isEditing) resetVendorData();
      setIsOpen(false);
      if (onVendorAdded) onVendorAdded();
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {isEditing ? "Edit Vendor" : "+ Add New Vendor"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update vendor details." : "Add a new vendor to your services."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <PersonalDetails
            customerData={vendorData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleStatusChange={handleStatusChange}
          />
          <CompanyDetails
            customerData={vendorData}
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
                customerData={vendorData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
              />
              <PaymentTermsSection
                selectedTerm={vendorData.payment_terms}
                onTermChange={handlePaymentTermChange}
              />
            </TabsContent>

            <TabsContent value="address" className="tabs-content-transition">
              <AddressSection
                customerData={vendorData}
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
                customerData={vendorData}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Vendor" : "Add Vendor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default AddVendorModal;