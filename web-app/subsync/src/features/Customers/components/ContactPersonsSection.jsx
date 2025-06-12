import { UserPlus, Trash2 } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils.js";

import 'react-phone-number-input/style.css';

const ContactPersonsSection = ({ contactPersons, setContactPersons, errors = {} }) => {

  const handleInputChange = (id, field, value) => {
    const updatedPersons = contactPersons.map(person =>
      person.id === id ? { ...person, [field]: value } : person
    );
    setContactPersons(updatedPersons);
  };

  const handleContactPersonPhoneNumberChange = (id, value) => {
    const updatedPersons = contactPersons.map(person => {
      if (person.id === id) {
        if (value) {
          const phoneNumberObj = parsePhoneNumberFromString(value);
          if (phoneNumberObj && phoneNumberObj.isValid()) {
            return {
              ...person,
              phoneNumber: phoneNumberObj.nationalNumber || "",
              countryCode: phoneNumberObj.countryCallingCode ? `+${phoneNumberObj.countryCallingCode}` : "",
            };
          }
        }
        return { ...person, phoneNumber: "", countryCode: "" };
      }
      return person;
    });
    setContactPersons(updatedPersons);
  };

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      {
        id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        salutation: "Mr.",
        designation: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        countryCode: "+91",
      },
    ]);
  };

  const deleteContactPerson = (idToDelete) => {
    const updatedPersons = contactPersons.filter(person => person.id !== idToDelete);
    setContactPersons(updatedPersons);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border-r">Salutation</th>
              <th className="px-4 py-2 border-r">First Name</th>
              <th className="px-4 py-2 border-r">Last Name</th>
              <th className="px-4 py-2 border-r">Designation</th>
              <th className="px-4 py-2 border-r">Email Address</th>
              <th className="px-4 py-2 border-r">Phone</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactPersons.length > 0 ? (
              contactPersons.map((person, index) => {
                const personErrors = errors.otherContacts && errors.otherContacts[index] ? errors.otherContacts[index] : {};

                const hasSalutationError = personErrors.salutation;
                const hasFirstNameError = personErrors.firstName;
                const hasLastNameError = personErrors.lastName;
                const hasDesignationError = personErrors.designation;
                const hasEmailError = personErrors.email;
                const hasPhoneNumberError = personErrors.phoneNumber;

                const currentPhoneNumberFull = person.phoneNumber
                  ? `${person.countryCode || ''}${person.phoneNumber}`
                  : '';

                return (
                  <tr key={person.id} className="even:bg-gray-50">
                    <td className="px-4 py-2 border-r">
                      <Select
                        value={person.salutation || "Mr."}
                        onValueChange={(value) => handleInputChange(person.id, "salutation", value)}
                      >
                        <SelectTrigger className={cn("w-full", hasSalutationError && "border-red-500")}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Ms.">Ms.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                          <SelectItem value="Dr.">Dr.</SelectItem>
                        </SelectContent>
                      </Select>
                      {hasSalutationError && (
                        <p className="text-red-500 text-xs mt-1">{hasSalutationError}</p>
                      )}
                    </td>
                    <td className="px-4 py-2 border-r">
                      <Input
                        value={person.firstName || ""}
                        onChange={(e) => handleInputChange(person.id, "firstName", e.target.value)}
                        className={cn(hasFirstNameError && "border-red-500")}
                        aria-invalid={hasFirstNameError ? "true" : undefined}
                      />
                      {hasFirstNameError && (
                        <p className="text-red-500 text-xs mt-1">{hasFirstNameError}</p>
                      )}
                    </td>
                    <td className="px-4 py-2 border-r">
                      <Input
                        value={person.lastName || ""}
                        onChange={(e) => handleInputChange(person.id, "lastName", e.target.value)}
                        className={cn(hasLastNameError && "border-red-500")}
                        aria-invalid={hasLastNameError ? "true" : undefined}
                      />
                      {hasLastNameError && (
                        <p className="text-red-500 text-xs mt-1">{hasLastNameError}</p>
                      )}
                    </td>
                    <td className="px-4 py-2 border-r">
                      <Input
                        value={person.designation || ""}
                        onChange={(e) => handleInputChange(person.id, "designation", e.target.value)}
                        className={cn(hasDesignationError && "border-red-500")}
                        aria-invalid={hasDesignationError ? "true" : undefined}
                      />
                      {hasDesignationError && (
                        <p className="text-red-500 text-xs mt-1">{hasDesignationError}</p>
                      )}
                    </td>
                    <td className="px-4 py-2 border-r">
                      <Input
                        type="email"
                        value={person.email || ""}
                        onChange={(e) => handleInputChange(person.id, "email", e.target.value)}
                        className={cn(hasEmailError && "border-red-500")}
                        aria-invalid={hasEmailError ? "true" : undefined}
                      />
                      {hasEmailError && (
                        <p className="text-red-500 text-xs mt-1">{hasEmailError}</p>
                      )}
                    </td>
                    <td className="px-4 py-2 border-r">
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={currentPhoneNumberFull}
                        onChange={(value) => handleContactPersonPhoneNumberChange(person.id, value)}
                        className={cn("phone-input-custom-style min-h-[2.25rem] shadow-sm", hasPhoneNumberError && "phone-input-error")}
                        placeholder="Enter phone number"
                        aria-invalid={hasPhoneNumberError ? "true" : undefined}
                      />
                      {hasPhoneNumberError && (
                        <p className="text-red-500 text-xs mt-1">{hasPhoneNumberError}</p>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteContactPerson(person.id)}
                        title="Delete Contact Person"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Contact Person</span>
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No contact persons added yet. Click "Add Contact" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Button onClick={addContactPerson} type="button">
        <UserPlus className="mr-2 h-4 w-4" /> Add Contact
      </Button>
    </div>
  );
};

export default ContactPersonsSection;
