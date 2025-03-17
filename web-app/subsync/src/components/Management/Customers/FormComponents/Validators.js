const isValidGSTIN = (gstin) => {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstin);
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhoneNumber = (phone) => {
  return /^\+?[1-9]\d{0,2}[-.\s]?\d{6,14}$/.test(phone);
};


const validateCustomerData = (customerData) => {
  // Validate Salutation
  if (!customerData.salutation) {
    throw new Error("Salutation is required.");
  }

  // Validate First Name
  if (!customerData.firstName || !/^[a-zA-Z ]+$/.test(customerData.firstName)) {
    throw new Error("First name is required and must contain only alphabets.");
  }

  // Validate Last Name
  if (!customerData.lastName || !/^[a-zA-Z ]+$/.test(customerData.lastName)) {
    throw new Error("Last name is required and must contain only alphabets.");
  }

  // Validate Email
  if (!isValidEmail(customerData.email)) {
    throw new Error("Invalid email address format.");
  }

  // Validate Phone Number
  if (!isValidPhoneNumber(customerData.phoneNumber)) {
    throw new Error("Phone number is required and must be a 10-digit number.");
  }

  // Validate Address
  const { address } = customerData;
  if (!address || !address.addressLine || !address.city || !address.state || !address.zipCode || !address.country) {
    throw new Error("Complete address is required.");
  }

  // Validate Company Name
  if (!customerData.companyName || customerData.companyName.length > 100) {
    throw new Error("Company name is required and must be within 100 characters.");
  }

  // Validate Display Name
  if (!customerData.displayName) {
    throw new Error("Display name is required.");
  }

  // Validate GSTIN
  if (!isValidGSTIN(customerData.gstin)) {
    throw new Error("Invalid GSTIN format.");
  }

  // Validate Currency Code
  if (!customerData.currencyCode) {
    throw new Error("Currency code is required.");
  }

  // Validate GST Treatment
  if (!customerData.gst_treatment) {
    throw new Error("GST treatment is required.");
  }

  // Validate Tax Preference
  if (!customerData.tax_preference) {
    throw new Error("Tax preference is required.");
  }

  // Validate Notes (Optional)
  if (customerData.notes && customerData.notes.length > 500) {
    throw new Error("Notes must be within 500 characters.");
  }
};

export default validateCustomerData;
