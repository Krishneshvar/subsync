/**
 * Function to get current timestamp in "YYYY-MM-DD HH:MM:SS" format
 * @returns {string} The timestamp in "YYYY-MM-DD HH:MM:SS" format
 */
function getCurrentTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Function to add days to a given timestamp. Used for calculating expiry timestamp of a product
 * @param   {Timestamp} startTimestamp The timestamp on which the days are to be added
 * @param   {Number}    daysToAdd      The number of days to be added to the given timestamp
 * @returns {string}                   The timestamp after the given number of days are added
 */
function addDaysToTimestamp(startTimestamp, daysToAdd) {
    const date = new Date(startTimestamp);
  
    if (isNaN(date.getTime())) {
      throw new Error("Invalid timestamp format. Use 'YYYY-MM-DD HH:MM:SS'.");
    }

    date.setDate(date.getDate() + daysToAdd);

    const pad = (num) => String(num).padStart(2, "0");

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

export { getCurrentTime, addDaysToTimestamp };
