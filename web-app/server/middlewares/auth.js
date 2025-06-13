import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from './tokenBlacklist.js';

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ error: "No token provided or token expired" });
    }

    try {
        const blacklisted = await isTokenBlacklisted(token);
        if (blacklisted) {
            console.log("Attempted use of blacklisted token:", token.substring(0, 20), "...");
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                path: '/',
            });
            return res.status(401).json({ error: "Session expired or logged out. Please log in again." });
        }
    } catch (blacklistError) {
        console.error("Error during blacklist check:", blacklistError);
        return res.status(500).json({ error: "Authentication service error. Please try again." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined in environment variables!");
        return res.status(500).json({ error: "Server configuration error." });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                path: '/',
            });
            const errorMessage = err.name === 'TokenExpiredError' ? "Session expired. Please log in again." : "Invalid token.";
            return res.status(403).json({ error: errorMessage });
        }
        req.user = user;
        next();
    });
};
