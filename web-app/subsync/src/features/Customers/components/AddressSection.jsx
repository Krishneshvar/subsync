import Select from "react-select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils.js";

const AddressSection = ({
  customerData = {},
  handleInputChange,
  handleSelectChange,
  countries,
  states = [],
  errors = {},
}) => {
  const address = customerData.address || {};

  const handleCountryChange = (selectedOption) => {
    handleSelectChange("address.country", selectedOption);
    handleSelectChange("address.state", null);
  };

  const handleStateChange = (selectedOption) => {
    handleSelectChange("address.state", selectedOption);
  };

  const hasAddressLineError = errors["address.addressLine"];
  const hasCountryError = errors["address.country"];
  const hasStateError = errors["address.state"];
  const hasCityError = errors["address.city"];
  const hasZipCodeError = errors["address.zipCode"];

  return (
    <>
      <div className="grid grid-cols-1 gap-y-2 mb-4">
        <Label htmlFor="addressLine" className="mb-2">Address Line</Label>
        <Input
          id="addressLine"
          type="text"
          name="address.addressLine"
          value={address.addressLine || ""}
          onChange={handleInputChange}
          className={cn(
            "rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            hasAddressLineError && "border-red-500 focus-visible:ring-red-500"
          )}
          aria-invalid={hasAddressLineError ? "true" : undefined}
          aria-describedby={hasAddressLineError ? "addressLine-error" : undefined}
        />
        {hasAddressLineError && (
          <p id="addressLine-error" className="text-red-500 text-sm mt-1">{hasAddressLineError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
        <div className="flex flex-col">
          <Label htmlFor="country" className="mb-2">Country</Label>
          <Select
            id="country"
            placeholder="Select Country"
            options={countries}
            value={address.country}
            onChange={handleCountryChange}
            className={cn(
              "react-select-container shadow-sm",
              hasCountryError && "border-red-500 focus-visible:ring-red-500 rounded-lg"
            )}
            classNamePrefix="react-select"
            aria-invalid={hasCountryError ? "true" : undefined}
            aria-describedby={hasCountryError ? "country-error" : undefined}
          />
          {hasCountryError && (
            <p id="country-error" className="text-red-500 text-sm mt-1">{hasCountryError}</p>
          )}
        </div>

        <div className="flex flex-col">
          <Label htmlFor="state" className="mb-2">State</Label>
          <Select
            id="state"
            placeholder="Select State"
            options={states}
            value={address.state}
            onChange={handleStateChange}
            className={cn(
              "react-select-container shadow-sm",
              hasStateError && "border-red-500 focus-visible:ring-red-500 rounded-lg"
            )}
            classNamePrefix="react-select"
            isDisabled={states.length === 0}
            aria-invalid={hasStateError ? "true" : undefined}
            aria-describedby={hasStateError ? "state-error" : undefined}
          />
          {hasStateError && (
            <p id="state-error" className="text-red-500 text-sm mt-1">{hasStateError}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
        <div className="flex flex-col">
          <Label htmlFor="city" className="mb-2">City</Label>
          <Input
            id="city"
            type="text"
            name="address.city"
            value={address.city || ""}
            onChange={handleInputChange}
            className={cn(
              "rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              hasCityError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={hasCityError ? "true" : undefined}
            aria-describedby={hasCityError ? "city-error" : undefined}
          />
          {hasCityError && (
            <p id="city-error" className="text-red-500 text-sm mt-1">{hasCityError}</p>
          )}
        </div>

        <div className="flex flex-col">
          <Label htmlFor="zipCode" className="mb-2">Zip Code</Label>
          <Input
            id="zipCode"
            type="text"
            name="address.zipCode"
            value={address.zipCode || ""}
            onChange={handleInputChange}
            className={cn(
              "rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              hasZipCodeError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={hasZipCodeError ? "true" : undefined}
            aria-describedby={hasZipCodeError ? "zipCode-error" : undefined}
          />
          {hasZipCodeError && (
            <p id="zipCode-error" className="text-red-500 text-sm mt-1">{hasZipCodeError}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AddressSection;
