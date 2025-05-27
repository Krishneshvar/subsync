import Select from "react-select";
import { indianStates } from "@/features/Customers/data/statesOfIndia.js"; // Corrected path to be relative to features
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddressSection = ({
  customerData = {},
  handleInputChange,
  handleSelectChange,
  countries,
  states,
  setStates,
}) => {
  const handleCountryChange = (selectedOption) => {
    // Pass the entire selectedOption object or just its value as needed by parent
    handleSelectChange("address", {
      ...(customerData.address || {}), // Ensure address object exists
      country: selectedOption ? selectedOption.value : "", // Handle null selectedOption
      state: "", // Reset state when country changes
    });

    if (selectedOption && selectedOption.value === "IN") {
      setStates(indianStates);
    } else {
      setStates([]);
    }
  };

  const handleStateChange = (selectedOption) => {
    handleSelectChange("address", {
      ...(customerData.address || {}), // Ensure address object exists
      state: selectedOption ? selectedOption.value : "", // Handle null selectedOption
    });
  };

  const address = customerData.address || {}; // Ensure address is an object

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-12">
          <Label htmlFor="addressLine">Address Line</Label>
          <Input
            id="addressLine"
            type="text"
            name="address.addressLine" // Use name attribute for nested objects if handleInputChange expects it
            value={address.addressLine || ""}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" // Shadcn Input classes
          />
        </div>
      </div>

      {/* Country and State */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            options={countries}
            value={countries.find((option) => option.value === address.country) || null}
            onChange={handleCountryChange}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{ // Applied similar styles as in PersonalDetails
              control: (provided) => ({
                ...provided,
                borderRadius: "0.5rem",
                minHeight: "2.5rem",
                fontSize: "1rem",
                padding: "0.25rem 0.5rem",
                borderColor: '#e2e8f0',
                '&:hover': {
                  borderColor: '#cbd5e1',
                },
                boxShadow: 'none',
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: '0px 8px',
              }),
              input: (provided) => ({
                ...provided,
                margin: '0px',
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'none',
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                height: '2.5rem',
              }),
            }}
          />
        </div>
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="state">State</Label>
          <Select
            id="state"
            options={states}
            value={states.find((option) => option.value === address.state) || null}
            onChange={handleStateChange}
            isDisabled={!states || states.length === 0} // Disable if no states are available
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{ // Applied similar styles as in PersonalDetails
              control: (provided) => ({
                ...provided,
                borderRadius: "0.5rem",
                minHeight: "2.5rem",
                fontSize: "1rem",
                padding: "0.25rem 0.5rem",
                borderColor: '#e2e8f0',
                '&:hover': {
                  borderColor: '#cbd5e1',
                },
                boxShadow: 'none',
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: '0px 8px',
              }),
              input: (provided) => ({
                ...provided,
                margin: '0px',
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'none',
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                height: '2.5rem',
              }),
            }}
          />
        </div>
      </div>

      {/* City and Zip Code */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            name="address.city"
            value={address.city || ""}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" // Shadcn Input classes
          />
        </div>
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            type="text"
            name="address.zipCode"
            value={address.zipCode || ""}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" // Shadcn Input classes
          />
        </div>
      </div>
    </>
  );
};

export default AddressSection;
