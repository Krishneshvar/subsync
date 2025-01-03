// Function to get current timestamp in "YYYY-MM-DD HH:MM:SS" format
function getCurrentTime() {
  // Get the current date and time
  const now = new Date();

  // Extract the components of the date and time
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format the string as "YYYY-MM-DD HH:MM:SS"
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to add days to a given timestamp. Used for calculating expiry timestamp of a product
function addDaysToTimestamp(startTimestamp, daysToAdd) {
    // Parse the input timestamp into a Date object
    const date = new Date(startTimestamp);
  
    if (isNaN(date.getTime())) {
      throw new Error("Invalid timestamp format. Use 'YYYY-MM-DD HH:MM:SS'.");
    }
  
    // Add the specified number of days
    date.setDate(date.getDate() + daysToAdd);
  
    // Format the date back to "YYYY-MM-DD HH:MM:SS"
    const pad = (num) => String(num).padStart(2, "0");

    // Format the Date and Time to the required format
    const formattedDate = [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join("-");

    const formattedTime = [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds())
    ].join(":");
  
    return `${formattedDate} ${formattedTime}`;
}

// Export these function to be reused in other modules
export { getCurrentTime, addDaysToTimestamp };
