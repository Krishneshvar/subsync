import { checkLogin } from '../models/loginModel.js';

/**
 * Function to be executed when user login details are sent for validation
 * @param   {Request}  req The request received from the client in an endpoint
 * @param   {Response} res The response sent to the client in that endpoint
 * @returns {Promise<*>}
 */
const validateLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const valid = await checkLogin(username, password);

        if (valid) {
            return res.status(200).json({ success: true, message: "Validation successful." });
        }
        else {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }
    }
    catch (error) {
        console.error("Error during login validation:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export { validateLogin };
