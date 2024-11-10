import appDB from "../db/subsyncDB.js";

async function checkLogin(username, inputPassword) {
    try {
        const result = await appDB.query("SELECT password FROM users WHERE username = ?;", [username]);

        if (result[0].length === 0) { return 0; }

        const dbPassword = result[0][0].password;
        const match = (inputPassword == dbPassword); // await bcrypt.compare(inputPassword, dbPassword);

        return match ? 1 : 0;
    }
    catch (err) {
        console.error("Error during login:", err);
        throw err;
    }
}

export { checkLogin };
