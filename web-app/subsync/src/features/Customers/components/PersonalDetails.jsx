import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { parsePhoneNumberFromString } from "libphonenumber-js";
// Shadcn UI Imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PersonalDetails = ({ customerData, handleInputChange, handleSelectChange, handleStatusChange }) => {

  // Function to determine the current full phone number for PhoneInput
  const getCurrentPhoneNumber = () => {
    if (customerData.country_code && customerData.phoneNumber) {
      // libphonenumber-js expects full E.164 format for parsing if country code is present
      // PhoneInput's value prop expects E.164 format
      if (customerData.country_code.startsWith('+')) {
        return `${customerData.country_code}${customerData.phoneNumber}`;
      }
      return `+${customerData.country_code}${customerData.phoneNumber}`; // Ensure it starts with +
    }
    return "";
  };

  const handlePhoneNumberChange = (value) => {
    // 'value' from react-phone-number-input is the full E.164 number (e.g., "+12025550100")
    if (value) {
      const phoneNumberObj = parsePhoneNumberFromString(value);
      if (phoneNumberObj && phoneNumberObj.isValid()) { // Check if valid before extracting
        handleInputChange({
          target: { name: "country_code", value: phoneNumberObj.countryCallingCode ? `+${phoneNumberObj.countryCallingCode}` : "" }
        });
        handleInputChange({
          target: { name: "phoneNumber", value: phoneNumberObj.nationalNumber || "" }
        });
      } else {
        // If parsing fails or invalid, reset values to empty
        handleInputChange({ target: { name: "country_code", value: "" } });
        handleInputChange({ target: { name: "phoneNumber", value: "" } });
      }
    } else {
      // If input is cleared, reset values
      handleInputChange({ target: { name: "country_code", value: "" } });
      handleInputChange({ target: { name: "phoneNumber", value: "" } });
    }
  };

  const salutationOptions = [
    { label: "Mr.", value: "Mr." },
    { label: "Ms.", value: "Ms." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Dr.", value: "Dr." },
  ];

  return (
    <>
      {/* Replaced Row and Col with Tailwind CSS flex/grid for layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4"> {/* Adjusted gap for better spacing */}
        {/* Customer Status - Replaced ToggleButtonGroup/ToggleButton */}
        <div className="flex flex-col mb-4 md:col-span-12">
          <Label htmlFor="customer-status" className="mb-2">Customer Status</Label>
          <div className="inline-flex rounded-md shadow-sm w-max" role="group">
            <Button
              id="tbg-radio-1"
              variant={customerData.customerStatus === "Active" ? "default" : "outline"} // Use default for selected, outline for unselected
              className={`rounded-r-none ${customerData.customerStatus === "Active" ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
              onClick={() => handleStatusChange("Active")}
            >
              Active
            </Button>
            <Button
              id="tbg-radio-2"
              variant={customerData.customerStatus === "Inactive" ? "destructive" : "outline"} // Use destructive for selected Inactive, outline for unselected
              className={`rounded-l-none ${customerData.customerStatus === "Inactive" ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-600 text-red-600 hover:bg-red-50'}`}
              onClick={() => handleStatusChange("Inactive")}
            >
              Inactive
            </Button>
          </div>
        </div>

        {/* Salutation */}
        <div className="flex flex-col mb-2 md:col-span-2"> {/* md:col-span-2 for 2/12 width */}
          <Label htmlFor="salutation">Salutation</Label>
          <Select
            id="salutation"
            options={salutationOptions}
            value={salutationOptions.find(option => option.value === customerData.salutation) || null}
            onChange={(selectedOption) => handleSelectChange("salutation", selectedOption ? selectedOption.value : null)}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            className="react-select-container" // Add a class for potential custom styling via global CSS
            classNamePrefix="react-select" // Add a prefix for react-select's internal classes
            styles={{ // Inline styles from react-bootstrap removed, applying general sizing
              control: (provided) => ({
                ...provided,
                borderRadius: "0.5rem", // Tailwind rounded-lg approx
                minHeight: "2.5rem", // Tailwind h-10 approx
                fontSize: "1rem", // Tailwind text-base approx
                padding: "0.25rem 0.2rem", // Equivalent to p-2 or px-2 py-1
                borderColor: '#e2e8f0', // Default border color for shadcn inputs
                '&:hover': {
                  borderColor: '#cbd5e1', // Hover border color
                },
                boxShadow: 'none', // Remove default react-select shadow
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: '0px 8px', // Adjust internal padding
              }),
              input: (provided) => ({
                ...provided,
                margin: '0px', // Remove default margin
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'none', // Remove separator line
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                height: '2.5rem', // Match control height
              }),
            }}
          />
        </div>

        {/* First Name */}
        <div className="flex flex-col mb-4 md:col-span-5"> {/* md:col-span-5 for 5/12 width */}
          <Label htmlFor="firstName">First Name</Label>
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

        {/* Last Name */}
        <div className="flex flex-col mb-4 md:col-span-5"> {/* md:col-span-5 for 5/12 width */}
          <Label htmlFor="lastName">Last Name</Label>
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 mb-4"> {/* New Row for Phone/Email */}
        {/* Phone Number */}
        <div className="flex flex-col mb-4 md:col-span-6"> {/* md:col-span-6 for 6/12 width */}
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="relative"> {/* Use relative for potential absolute positioning of input elements if needed */}
            <PhoneInput
              international
              defaultCountry="IN"
              value={getCurrentPhoneNumber()}
              onChange={handlePhoneNumberChange}
              className="phone-input-custom-style" // Custom class for external CSS if needed
              placeholder="Enter phone number"
              // The default styling of react-phone-number-input creates its own structure
              // We'll apply shadcn-like styles to its internal elements via global CSS or custom styling
              // This className helps target it specifically
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col mb-4 md:col-span-6"> {/* md:col-span-6 for 6/12 width */}
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email" // Changed type to email for better validation
            name="email"
            value={customerData.email}
            onChange={handleInputChange}
            required
            className="rounded-lg px-4 py-2 text-base border border-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" // Shadcn Input classes
          />
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;
