import Select from "react-select";
import { indianStates } from "@/features/Customers/data/statesOfIndia.js";
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
    handleSelectChange("address.country", selectedOption);
    handleSelectChange("address.state", null);

    if (selectedOption && selectedOption.value === "IN") {
      setStates(indianStates);
    } else {
      setStates([]);
    }
  };

  const handleStateChange = (selectedOption) => {
    handleSelectChange("address.state", selectedOption);
  };

  const address = customerData.address || {};

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-12">
          <Label htmlFor="addressLine" className="mb-2"> Address Line </Label>
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
          <Label htmlFor="country" className="mb-2"> Country </Label>
          <Select
            id="country"
            placeholder="Select Country"
            options={countries}
            value={(() => {
              const selectedCountryOption = countries.find(
                (option) => option.value === address.country
              );
              return selectedCountryOption || null;
            })()}
            onChange={handleCountryChange}
            className="react-select-container shadow-sm"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="state" className="mb-2"> State </Label>
          <Select
            id="state"
            placeholder="Select State"
            options={states}
            value={(() => {
              const selectedStateOption = states.find(
                (option) => option.value === address.state
              );
              return selectedStateOption || null;
            })()}
            onChange={handleStateChange}
            className="react-select-container shadow-sm"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4">
        <div className="flex flex-col mb-4 md:col-span-6">
          <Label htmlFor="city" className="mb-2"> City </Label>
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
          <Label htmlFor="zipCode" className="mb-2"> Zip Code </Label>
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
