// Regex function to validate GST number
function isValidGSTIN(gstno) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    return gstRegex.test(gstno);
}

// Regex function to validate Email address
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Regex function to validate phone number
function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^[0-9]{10,13}$/;
    return phoneRegex.test(phoneNumber);
}

// Export these function to be reused in other modules
export { isValidGSTIN, isValidEmail, isValidPhoneNumber }
