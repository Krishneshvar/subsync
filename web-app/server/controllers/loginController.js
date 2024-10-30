import { checkLogin } from "../models/loginModel.js";

const validateLogin = async (req, res) => {
    const { user_id, password } = req.body;

    try {
        const validation = await checkLogin(user_id, password);

        if (validation === 1) {
            return res.status(200).json({ success: true, message: "Validation successful." });
        }
        else {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export { validateLogin };
