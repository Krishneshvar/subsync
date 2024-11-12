export default function getCurrentTime() {
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
