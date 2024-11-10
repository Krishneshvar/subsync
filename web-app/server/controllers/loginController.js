import { checkLogin } from '../models/loginModel.js';

const validateLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const valid = await checkLogin(username, password);

        if (valid) {
            req.session.username = username; // Store username in session
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
