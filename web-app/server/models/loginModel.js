import appDB from "../db/subsyncDB.js";

/**
 * Function to retrieve user data for login validation.
 * @param   {string}                 username      The username to be validated
 * @returns {Promise<object|null>}               User object with password hash and other details, or null if not found
 */
async function getUserForLogin(username) {
    try {
        const [rows] = await appDB.query("SELECT username, name, password, role, email FROM users WHERE username = ?;", [username]);

        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    catch (err) {
        console.error("Error retrieving user for login:\n", err);
        throw err;
    }
}

export { getUserForLogin };
