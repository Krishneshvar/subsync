import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

const ContactPersonsSection = ({ contactPersons, setContactPersons }) => {
  const handleInputChange = (index, field, value) => {
    const updatedPersons = [...contactPersons];
    updatedPersons[index][field] = value;
    setContactPersons(updatedPersons);
  };

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      { salutation: "", designation: "", first_name: "", last_name: "", email: "", phone_number: "" },
    ]);
  };

  const deleteContactPerson = (index) => {
    const updatedPersons = contactPersons.filter((_, i) => i !== index);
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
            {contactPersons.map((person, index) => (
              <tr key={index} className="even:bg-gray-50">
                <td className="px-4 py-2 border-r">
                  <Select
                    value={person.salutation}
                    onValueChange={(value) => handleInputChange(index, "salutation", value)}
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
                    value={person.first_name}
                    onChange={(e) => handleInputChange(index, "first_name", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    value={person.last_name}
                    onChange={(e) => handleInputChange(index, "last_name", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    value={person.designation}
                    onChange={(e) => handleInputChange(index, "designation", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    type="email"
                    value={person.email}
                    onChange={(e) => handleInputChange(index, "email", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 border-r">
                  <Input
                    value={person.phone_number}
                    onChange={(e) => handleInputChange(index, "phone_number", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteContactPerson(index)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
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
