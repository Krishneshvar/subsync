function getCurrentTime() {
    const now = new Date(); // Get the current date and time

    // Extract the components of the date and time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format the string as "YYYY-MM-DD HH:MM:SS"
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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
  
    const formattedDate = [
      date.getFullYear(),
      pad(date.getMonth() + 1), // Months are 0-indexed in JavaScript
      pad(date.getDate())
    ].join("-");
  
    const formattedTime = [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds())
    ].join(":");
  
    return `${formattedDate} ${formattedTime}`;
}

export { getCurrentTime, addDaysToTimestamp };
