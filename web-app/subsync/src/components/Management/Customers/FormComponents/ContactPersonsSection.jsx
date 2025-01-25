// components/ContactPersonsSection.jsx
import React from "react";
import { Table, Button, Form } from "react-bootstrap";
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
      { salutation: "", first_name: "", last_name: "", email: "", phone_number: "" },
    ]);
  };

  const deleteContactPerson = (index) => {
    const updatedPersons = contactPersons.filter((_, i) => i !== index);
    setContactPersons(updatedPersons);
  };

  return (
    <>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Salutation</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email Address</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contactPersons.map((person, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  as="select"
                  value={person.salutation}
                  onChange={(e) => handleInputChange(index, "salutation", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Mrs.</option>
                  <option>Dr.</option>
                </Form.Control>
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={person.first_name}
                  onChange={(e) => handleInputChange(index, "first_name", e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={person.last_name}
                  onChange={(e) => handleInputChange(index, "last_name", e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="email"
                  value={person.email}
                  onChange={(e) => handleInputChange(index, "email", e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={person.phone_number}
                  onChange={(e) => handleInputChange(index, "phone_number", e.target.value)}
                />
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteContactPerson(index)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={addContactPerson}>
       <UserPlus />
  
      </Button>
    </>
  );
};

export default ContactPersonsSection;
