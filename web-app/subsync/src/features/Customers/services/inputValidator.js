const isValidGSTIN = (gstin) => {
  if (!gstin) return false;
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstin);
};

const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  return /^\+?[1-9]\d{6,14}$/.test(phone.replace(/[\s-()]/g, ''));
};

/**
 * Validates customer data and returns an object of errors.
 * Returns an empty object if no errors are found.
 * @param {Object} customerData - The customer data object to validate.
 * @returns {Object} An object where keys are field names and values are error messages.
 */
const validateCustomerData = (customerData) => {
  const errors = {};

  if (!customerData.salutation) {
    errors.salutation = "Salutation is required.";
  }

  if (!customerData.firstName || !/^[a-zA-Z\s]+$/.test(customerData.firstName)) {
    errors.firstName = "First name is required and must contain only alphabets and spaces.";
  }

  if (!customerData.lastName || !/^[a-zA-Z\s]+$/.test(customerData.lastName)) {
    errors.lastName = "Last name is required and must contain only alphabets and spaces.";
  }

  if (!customerData.email) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(customerData.email)) {
    errors.email = "Invalid email address format.";
  }

  if (!customerData.phoneNumber) {
    errors.phoneNumber = "Primary phone number is required.";
  } else if (!isValidPhoneNumber(customerData.phoneNumber)) {
    errors.phoneNumber = "Primary phone number must be in a valid format (e.g., +1234567890).";
  }

  if (customerData.secondaryPhoneNumber && !isValidPhoneNumber(customerData.secondaryPhoneNumber)) {
    errors.secondaryPhoneNumber = "Secondary phone number must be in a valid format (e.g., +1234567890).";
  }

  const { address } = customerData;
  if (!address || Object.keys(address).length === 0) {
    errors.address = "Complete address details are required.";
  } else {
    if (!address.addressLine) errors['address.addressLine'] = "Address line is required.";
    if (!address.city) errors['address.city'] = "City is required.";
    if (!address.state) errors['address.state'] = "State is required.";
    if (!address.zipCode) errors['address.zipCode'] = "Zip Code is required.";
    if (!address.country) errors['address.country'] = "Country is required.";
  }

  if (!customerData.companyName || customerData.companyName.length === 0) {
    errors.companyName = "Company name is required.";
  } else if (customerData.companyName.length > 100) {
    errors.companyName = "Company name must be within 100 characters.";
  }

  if (!customerData.displayName) {
    errors.displayName = "Display name is required.";
  }

  if (!customerData.gstin) {
    errors.gstin = "GSTIN is required.";
  } else if (!isValidGSTIN(customerData.gstin)) {
    errors.gstin = "Invalid GSTIN format. (e.g., 07ABCDE1234F1Z5)";
  }

  if (!customerData.currencyCode) {
    errors.currencyCode = "Currency code is required.";
  }

  if (!customerData.gst_treatment) {
    errors.gst_treatment = "GST treatment is required.";
  }

  if (!customerData.tax_preference) {
    errors.tax_preference = "Tax preference is required.";
  }

  if (customerData.notes && customerData.notes.length > 500) {
    errors.notes = "Notes must be within 500 characters.";
  }

  if (customerData.payment_terms) {
    if (!customerData.payment_terms.term_name) {
      errors['payment_terms.term_name'] = "Payment terms must include a term name.";
    }
    if (customerData.payment_terms.term_name && customerData.payment_terms.term_name.toLowerCase() !== 'due on receipt') {
      if (customerData.payment_terms.days === undefined || customerData.payment_terms.days === null || isNaN(customerData.payment_terms.days)) {
        errors['payment_terms.days'] = "Payment terms must include valid number of days.";
      } else if (customerData.payment_terms.days < 0) {
        errors['payment_terms.days'] = "Days cannot be negative.";
      }
    }
  } else {
      errors.payment_terms = "Payment terms are required.";
  }

  return errors;
};

export { validateCustomerData, isValidEmail, isValidPhoneNumber, isValidGSTIN };
