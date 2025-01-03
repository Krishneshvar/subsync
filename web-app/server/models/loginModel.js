import appDB from "../db/subsyncDB.js";

/**
 * Function to validate user login
 * @param   {string}                 username      The username to be validated
 * @param   {string}                 inputPassword The password input by the user
 * @returns {Promise<number|number>}               The result of validation
 */
async function checkLogin(username, inputPassword) {
    try {
        const result = await appDB.query("SELECT password FROM users WHERE username = ?;", [username]);

        if (result[0].length === 0) { return 0; }

        const dbPassword = result[0][0].password;
        const match = (inputPassword == dbPassword); // await bcrypt.compare(inputPassword, dbPassword);

        return match ? 1 : 0;
    }
    catch (err) {
        console.error("Error during user login:\n", err);
        throw err;
    }
}

export { checkLogin };
