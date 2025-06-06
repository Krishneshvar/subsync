/**
 * Function to create a customer's ID in "CIDYYMMDDHHMMSS" format and export it
 * @returns {string} The customer ID in "CIDYYMMDDHHMMSS" format
 */
export const generateID = (text) => {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${text}${year}${month}${day}${hour}${minute}${second}`;
};
