import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import { cn } from "@/lib/utils.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import 'react-phone-number-input/style.css';

const PersonalDetails = ({ customerData, handleInputChange, handleSelectChange, handleStatusChange, errors = {} }) => {

  const getCurrentPhoneNumber = (type = 'primary') => {
    const phoneNumber = type === 'primary' ? customerData.phoneNumber : customerData.secondaryPhoneNumber;
    const countryCodePrefix = customerData.countryCode ? customerData.countryCode.startsWith('+') ? customerData.countryCode : `+${customerData.countryCode}` : '';
    if (countryCodePrefix && phoneNumber) {
      return `${countryCodePrefix}${phoneNumber}`;
    }
    return "";
  };

  const handlePhoneNumberChange = (value, type = 'primary') => {
    if (value) {
      const phoneNumberObj = parsePhoneNumberFromString(value);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        handleInputChange({
          target: { name: "countryCode", value: phoneNumberObj.countryCallingCode ? `+${phoneNumberObj.countryCallingCode}` : "" }
        });
        handleInputChange({
          target: { name: type === 'primary' ? "phoneNumber" : "secondaryPhoneNumber", value: phoneNumberObj.nationalNumber || "" }
        });
      } else {
        handleInputChange({ target: { name: "countryCode", value: "" } });
        handleInputChange({ target: { name: type === 'primary' ? "phoneNumber" : "secondaryPhoneNumber", value: "" } });
      }
    } else {
      handleInputChange({ target: { name: "countryCode", value: "" } });
      handleInputChange({ target: { name: type === 'primary' ? "phoneNumber" : "secondaryPhoneNumber", value: "" } });
    }
  };

  const salutationOptions = [
    { value: "Mr.", label: "Mr." },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Dr.", label: "Dr." },
  ];

  const selectedSalutation = salutationOptions.find(option => option.value === (customerData.salutation?.value || "Mr.")) || salutationOptions[0];

  const hasCustomerStatusError = errors.customerStatus;
  const hasSalutationError = errors.salutation;
  const hasFirstNameError = errors.firstName;
  const hasLastNameError = errors.lastName;
  const hasPrimaryPhoneNumberError = errors.phoneNumber;
  const hasSecondaryPhoneNumberError = errors.secondaryPhoneNumber;
  const hasEmailError = errors.email;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-12">
          <Label htmlFor="customer-status" className="mb-2">Customer Status</Label>
          <div className="inline-flex rounded-md shadow-sm w-max" role="group">
            <Button
              id="tbg-radio-1"
              type="button"
              className={cn(
                "rounded-r-none",
                customerData.customerStatus === "Active"
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'border border-green-600 text-green-600 hover:bg-green-50'
              )}
              onClick={() => handleStatusChange("Active")}
            >
              Active
            </Button>
            <Button
              id="tbg-radio-2"
              type="button"
              className={cn(
                "rounded-l-none",
                customerData.customerStatus === "Inactive"
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'border border-red-600 text-red-600 hover:bg-red-50'
              )}
              onClick={() => handleStatusChange("Inactive")}
            >
              Inactive
            </Button>
          </div>
          {hasCustomerStatusError && (
            <p id="customerStatus-error" className="text-red-500 text-sm mt-1">{hasCustomerStatusError}</p>
          )}
        </div>

        <div className="flex flex-col mb-2 md:col-span-2">
          <Label htmlFor="salutation" className="mb-2">Salutation</Label>
          <Select
            id="salutation"
            options={salutationOptions}
            value={selectedSalutation}
            onChange={(selectedOption) => handleSelectChange("salutation", selectedOption)}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            classNamePrefix="react-select"
            className={cn(
              "react-select-container rounded-md shadow-sm",
              hasSalutationError && "border-red-500 rounded-md"
            )}
            placeholder="Select Salutation"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "white",
                borderColor: hasSalutationError ? "red" : "#d1d5db",
                minHeight: "2.25rem",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                padding: "0px 4px",
                boxShadow: hasSalutationError ? "0 0 0 1px red" : base.boxShadow,
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
            aria-invalid={hasSalutationError ? "true" : undefined}
            aria-describedby={hasSalutationError ? "salutation-error" : undefined}
          />
          {hasSalutationError && (
            <p id="salutation-error" className="text-red-500 text-sm mt-1">{hasSalutationError}</p>
          )}
        </div>

        <div className="flex flex-col mb-4 md:col-span-5">
          <Label htmlFor="firstName" className="mb-2">First Name</Label>
          <Input
            id="firstName"
            type="text"
            name="firstName"
            value={customerData.firstName || ""}
            onChange={handleInputChange}
            className={cn(
              "rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              hasFirstNameError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={hasFirstNameError ? "true" : undefined}
            aria-describedby={hasFirstNameError ? "firstName-error" : undefined}
          />
          {hasFirstNameError && (
            <p id="firstName-error" className="text-red-500 text-sm mt-1">{hasFirstNameError}</p>
          )}
        </div>

        <div className="flex flex-col mb-4 md:col-span-5">
          <Label htmlFor="lastName" className="mb-2">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            name="lastName"
            value={customerData.lastName || ""}
            onChange={handleInputChange}
            className={cn(
              "rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              hasLastNameError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={hasLastNameError ? "true" : undefined}
            aria-describedby={hasLastNameError ? "lastName-error" : undefined}
          />
          {hasLastNameError && (
            <p id="lastName-error" className="text-red-500 text-sm mt-1">{hasLastNameError}</p>
          )}
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
              className={cn(
                "phone-input-custom-style min-h-[2.25rem] shadow-sm",
                hasPrimaryPhoneNumberError && "phone-input-error"
              )}
              placeholder="Enter primary phone number"
              aria-invalid={hasPrimaryPhoneNumberError ? "true" : undefined}
              aria-describedby={hasPrimaryPhoneNumberError ? "primaryPhoneNumber-error" : undefined}
            />
          </div>
          {hasPrimaryPhoneNumberError && (
            <p id="primaryPhoneNumber-error" className="text-red-500 text-sm mt-1">{hasPrimaryPhoneNumberError}</p>
          )}
        </div>

        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="secondaryPhoneNumber" className="mb-2">Secondary Phone Number</Label>
          <div className="relative">
            <PhoneInput
              international
              defaultCountry="IN"
              value={getCurrentPhoneNumber('secondary')}
              onChange={(value) => handlePhoneNumberChange(value, 'secondary')}
              className={cn(
                "phone-input-custom-style min-h-[2.25rem] shadow-sm",
                hasSecondaryPhoneNumberError && "phone-input-error"
              )}
              placeholder="Enter secondary phone number (optional)"
              aria-invalid={hasSecondaryPhoneNumberError ? "true" : undefined}
              aria-describedby={hasSecondaryPhoneNumberError ? "secondaryPhoneNumber-error" : undefined}
            />
          </div>
          {hasSecondaryPhoneNumberError && (
            <p id="secondaryPhoneNumber-error" className="text-red-500 text-sm mt-1">{hasSecondaryPhoneNumberError}</p>
          )}
        </div>

        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="email" className="mb-2">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={customerData.email || ""}
            onChange={handleInputChange}
            className={cn(
              "rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              hasEmailError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={hasEmailError ? "true" : undefined}
            aria-describedby={hasEmailError ? "email-error" : undefined}
          />
          {hasEmailError && (
            <p id="email-error" className="text-red-500 text-sm mt-1">{hasEmailError}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;
