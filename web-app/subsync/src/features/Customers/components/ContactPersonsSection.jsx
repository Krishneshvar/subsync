import { UserPlus, Trash2 } from "lucide-react"; // Import Trash2 for delete icon

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const ContactPersonsSection = ({ contactPersons, setContactPersons }) => {

  const handleInputChange = (id, field, value) => {
    const updatedPersons = contactPersons.map(person =>
      person.id === id ? { ...person, [field]: value } : person
    );
    setContactPersons(updatedPersons);
  };

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      // Generate a unique temporary ID for new contacts
      {
        id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Temporary unique ID
        salutation: "Mr.",
        designation: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        country_code: "+91", // Assuming a default country code
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
        <table className="w-full text-sm text-left border border-gray-300 rounded-md overflow-hidden">
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
            {/* Use person.id as key */}
            {contactPersons.map((person) => (
              <tr key={person.id} className="even:bg-gray-50">
                <td className="px-4 py-2 border-r">
                  <Select
                    value={person.salutation || "Mr."}
                    onValueChange={(value) => handleInputChange(person.id, "salutation", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    value={person.first_name || ""} // Ensure controlled component has a value
                    onChange={(e) => handleInputChange(person.id, "first_name", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    value={person.last_name || ""}
                    onChange={(e) => handleInputChange(person.id, "last_name", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    value={person.designation || ""}
                    onChange={(e) => handleInputChange(person.id, "designation", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    type="email"
                    value={person.email || ""}
                    onChange={(e) => handleInputChange(person.id, "email", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    value={person.phone_number || ""}
                    onChange={(e) => handleInputChange(person.id, "phone_number", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteContactPerson(person.id)} // Pass the unique ID
                  >
                    <Trash2 className="h-4 w-4" /> {/* Added icon for clarity */}
                    <span className="sr-only">Delete Contact Person</span>
                  </Button>
                </td>
              </tr>
            ))}
            {contactPersons.length === 0 && (
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
