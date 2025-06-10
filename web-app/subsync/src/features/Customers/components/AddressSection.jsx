import Select from "react-select";
import countryList from "react-select-country-list";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { indianStates } from "@/features/Customers/data/statesOfIndia.js";
import { useMemo } from "react"; // Import useMemo

const AddressSection = ({
  customerData = {},
  handleInputChange,
  handleSelectChange,
  countries, // Prop should now be the memoized list from AddCustomer
  states = [], // Prop should now be the states dynamically set in AddCustomer
  setStates = () => {}, // fallback to no-op if not provided
}) => {
  // Use the 'countries' prop directly, as it's already memoized in AddCustomer
  const countryOptions = countries;

  // Use memoized indianStates
  const allIndianStates = useMemo(() => indianStates, []);

  const handleCountryChange = (selectedOption) => {
    handleSelectChange("address.country", selectedOption); // selectedOption is {label, value}
    handleSelectChange("address.state", null); // Clear state when country changes

    // Update states based on selected country
    if (selectedOption && selectedOption.value === "IN") {
      setStates(allIndianStates);
    } else {
      setStates([]);
    }
  };

  const handleStateChange = (selectedOption) => {
    handleSelectChange("address.state", selectedOption); // selectedOption is {label, value} or null
  };

  const address = customerData.address || {};
  // The value for react-select's 'value' prop should be the object directly from state
  const countryValue = address.country; // This is already an object now
  const stateValue = address.state; // This is already an object or null now

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-12">
          <Label htmlFor="addressLine" className="mb-2">Address Line</Label>
          <Input
            id="addressLine"
            type="text"
            name="address.addressLine"
            value={address.addressLine || ""}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="country" className="mb-2">Country</Label>
          <Select
            id="country"
            placeholder="Select Country"
            options={countryOptions}
            value={countryValue} // Pass the object directly
            onChange={handleCountryChange}
            className="react-select-container shadow-sm"
            classNamePrefix="react-select"
          />
        </div>

        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="state" className="mb-2">State</Label>
          <Select
            id="state"
            placeholder="Select State"
            options={states} // Use the states prop (which is already an array of {label, value} objects)
            value={stateValue} // Pass the object directly
            onChange={handleStateChange}
            className="react-select-container shadow-sm"
            classNamePrefix="react-select"
            isDisabled={states.length === 0} // Disable if no states are available
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="city" className="mb-2">City</Label>
          <Input
            id="city"
            type="text"
            name="address.city"
            value={address.city || ""}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="zipCode" className="mb-2">Zip Code</Label>
          <Input
            id="zipCode"
            type="text"
            name="address.zipCode"
            value={address.zipCode || ""}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </>
  );
};

export default AddressSection;
