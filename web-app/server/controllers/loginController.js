import { getUserForLogin } from '../models/loginModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Function to be executed when user login details are sent for validation
 * @param   {Request}  req The request received from the client in an endpoint
 * @param   {Response} res The response sent to the client in that endpoint
 * @returns {Promise<*>}
 */
const validateLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    try {
        const user = await getUserForLogin(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }

        const userPayload = {
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email
        };

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined in environment variables!");
            return res.status(500).json({ success: false, message: "Server configuration error." });
        }

        const token = jwt.sign(userPayload, jwtSecret, { expiresIn: '1d' });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: userPayload
        });

    } catch (error) {
        console.error("Error during login validation:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * Endpoint to get current user details after successful authentication (via cookie)
 * @param {Request} req
 * @param {Response} res
 */
const getUserDetails = (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, user: req.user });
    }
    return res.status(401).json({ success: false, message: "Not authenticated." });
};

/**
 * Endpoint to handle user logout
 * @param {Request} req
 * @param {Response} res
 */
const logoutUser = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    return res.status(200).json({ success: true, message: "Logged out successfully." });
};

export { validateLogin, getUserDetails, logoutUser };
