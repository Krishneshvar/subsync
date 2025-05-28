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
  if (!customerData.salutation) {
    throw new Error("Salutation is required.");
  }

  if (!customerData.firstName || !/^[a-zA-Z ]+$/.test(customerData.firstName)) {
    throw new Error("First name is required and must contain only alphabets.");
  }

  if (!customerData.lastName || !/^[a-zA-Z ]+$/.test(customerData.lastName)) {
    throw new Error("Last name is required and must contain only alphabets.");
  }

  if (!isValidEmail(customerData.email)) {
    throw new Error("Invalid email address format.");
  }

  if (!isValidPhoneNumber(customerData.phoneNumber)) {
    throw new Error("Phone number is required and must be a 10-digit number.");
  }

  const { address } = customerData;
  if (!address || !address.addressLine || !address.city || !address.state || !address.zipCode || !address.country) {
    throw new Error("Complete address is required.");
  }

  if (!customerData.companyName || customerData.companyName.length > 100) {
    throw new Error("Company name is required and must be within 100 characters.");
  }

  if (!customerData.displayName) {
    throw new Error("Display name is required.");
  }

  if (!isValidGSTIN(customerData.gstin)) {
    throw new Error("Invalid GSTIN format.");
  }

  if (!customerData.currencyCode) {
    throw new Error("Currency code is required.");
  }

  if (!customerData.gst_treatment) {
    throw new Error("GST treatment is required.");
  }

  if (!customerData.tax_preference) {
    throw new Error("Tax preference is required.");
  }

  if (customerData.notes && customerData.notes.length > 500) {
    throw new Error("Notes must be within 500 characters.");
  }
};

export default validateCustomerData;
