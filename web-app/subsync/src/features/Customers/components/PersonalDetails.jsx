import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import 'react-phone-number-input/style.css';

const PersonalDetails = ({ customerData, handleInputChange, handleSelectChange, handleStatusChange }) => {

  const getCurrentPhoneNumber = (type = 'primary') => {
    const phoneNumber = type === 'primary' ? customerData.phoneNumber : customerData.secondaryPhoneNumber;
    if (customerData.country_code && phoneNumber) {
      if (customerData.country_code.startsWith('+')) {
        return `${customerData.country_code}${phoneNumber}`;
      }
      return `+${customerData.country_code}${phoneNumber}`;
    }
    return "";
  };

  const handlePhoneNumberChange = (value, type = 'primary') => {
    if (value) {
      const phoneNumberObj = parsePhoneNumberFromString(value);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        handleInputChange({
          target: { name: "country_code", value: phoneNumberObj.countryCallingCode ? `+${phoneNumberObj.countryCallingCode}` : "" }
        });
        handleInputChange({
          target: { name: type === 'primary' ? "phoneNumber" : "secondaryPhoneNumber", value: phoneNumberObj.nationalNumber || "" }
        });
      } else {
        handleInputChange({ target: { name: "country_code", value: "" } });
        handleInputChange({ target: { name: type === 'primary' ? "phoneNumber" : "secondaryPhoneNumber", value: "" } });
      }
    } else {
      handleInputChange({ target: { name: "country_code", value: "" } });
      handleInputChange({ target: { name: type === 'primary' ? "phoneNumber" : "secondaryPhoneNumber", value: "" } });
    }
  };

  const salutationOptions = [
    { value: "Mr.", label: "Mr." },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Dr.", label: "Dr." },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-12">
          <Label htmlFor="customer-status" className="mb-2">Customer Status</Label>
          <div className="inline-flex rounded-md shadow-sm w-max" role="group">
            <Button
              id="tbg-radio-1"
              type="button"
              variant={customerData.customerStatus === "Active" ? "default" : "outline"}
              className={`rounded-r-none ${customerData.customerStatus === "Active" ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
              onClick={() => handleStatusChange("Active")}
            >
              Active
            </Button>
            <Button
              id="tbg-radio-2"
              type="button"
              variant={customerData.customerStatus === "Inactive" ? "destructive" : "outline"}
              className={`rounded-l-none ${customerData.customerStatus === "Inactive" ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-600 text-red-600 hover:bg-red-50'}`}
              onClick={() => handleStatusChange("Inactive")}
            >
              Inactive
            </Button>
          </div>
        </div>

        <div className="flex flex-col mb-2 md:col-span-2">
          <Label htmlFor="salutation" className="mb-2">Salutation</Label>
          <Select
            id="salutation"
            options={salutationOptions}
            value={salutationOptions.find(option => option.value === customerData.salutation) || null}
            onChange={(selectedOption) => handleSelectChange("salutation", selectedOption ? selectedOption.value : null)}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            classNamePrefix="react-select"
            className="react-select-container rounded-md shadow-sm"
            placeholder="Select Salutation"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "white",
                borderColor: "#d1d5db",
                minHeight: "2.25rem",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                padding: "0px 4px",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 8px",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#0f172a",
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
              }),
              indicatorSeparator: () => ({
                display: "none",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "0 4px",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                zIndex: 20,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#e0f2fe" : "white",
                color: "#0f172a",
                cursor: "pointer",
              }),
            }}
          />
        </div>

        <div className="flex flex-col mb-4 md:col-span-5">
          <Label htmlFor="firstName" className="mb-2">First Name</Label>
          <Input
            id="firstName"
            type="text"
            name="firstName"
            value={customerData.firstName}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" // Shadcn Input classes
          />
        </div>

        <div className="flex flex-col mb-4 md:col-span-5">
          <Label htmlFor="lastName" className="mb-2">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            name="lastName"
            value={customerData.lastName}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" // Shadcn Input classes
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="primaryPhoneNumber" className="mb-2">Primary Phone Number</Label>
          <div className="relative">
            <PhoneInput
              international
              defaultCountry="IN"
              value={getCurrentPhoneNumber('primary')}
              onChange={(value) => handlePhoneNumberChange(value, 'primary')}
              className="phone-input-custom-style min-h-[2.25rem] shadow-sm"
              placeholder="Enter primary phone number"
            />
          </div>
        </div>

        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="secondaryPhoneNumber" className="mb-2">Secondary Phone Number</Label>
          <div className="relative">
            <PhoneInput
              international
              defaultCountry="IN"
              value={getCurrentPhoneNumber('secondary')}
              onChange={(value) => handlePhoneNumberChange(value, 'secondary')}
              className="phone-input-custom-style min-h-[2.25rem] shadow-sm"
              placeholder="Enter secondary phone number (optional)"
            />
          </div>
        </div>

        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="email" className="mb-2">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={customerData.email}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;
