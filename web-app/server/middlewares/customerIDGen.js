export const generateID = () => {
    const now = new Date();
    
    // Get current year, month, day, hour, minute, and second
    const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(now.getDate()).padStart(2, '0'); // Ensure 2-digit day
    const hour = String(now.getHours()).padStart(2, '0'); // Ensure 2-digit hour
    const minute = String(now.getMinutes()).padStart(2, '0'); // Ensure 2-digit minute
    const second = String(now.getSeconds()).padStart(2, '0'); // Ensure 2-digit second
  
    // Combine into the required format
    return `CID${year}${month}${day}${hour}${minute}${second}`;
};
