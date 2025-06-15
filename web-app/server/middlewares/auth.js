import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from './tokenBlacklist.js'; // Assuming this path is correct
import logger from '../utils/logger.js'; // Assuming you have a logger utility at this path

export const isAuthenticated = async (req, res, next) => {
    // 1. Try to get token from Authorization header (Bearer token)
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        logger.debug('Token found in Authorization header (Bearer).');
    }

    // 2. If not in header, try to get token from cookies
    if (!token) {
        token = req.cookies?.jwt;
        if (token) {
            logger.debug('Token found in cookie.');
        }
    }

    // If no token found at all
    if (!token) {
        logger.warn('Authentication failed: No token provided (neither Bearer nor cookie).');
        return res.status(401).json({ error: "Authentication required: No token provided or token expired" });
    }

    logger.debug('Token extracted (first 20 chars):', token.substring(0, 20), '...');

    try {
        const blacklisted = await isTokenBlacklisted(token);
        if (blacklisted) {
            logger.warn("Attempted use of blacklisted token. Clearing cookie if present.", { token: token.substring(0, 20) + '...' });
            // Only clear if it was a cookie token, not a bearer token (bearer tokens aren't typically cleared this way)
            if (req.cookies?.jwt && req.cookies.jwt === token) {
                res.clearCookie('jwt', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    path: '/',
                });
            }
            return res.status(401).json({ error: "Session expired or logged out. Please log in again." });
        }
    } catch (blacklistError) {
        logger.error("Error during token blacklist check:", blacklistError);
        return res.status(500).json({ error: "Authentication service error. Please try again." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        logger.error("Server Error: JWT_SECRET environment variable is not defined!");
        return res.status(500).json({ error: "Server configuration error." });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            logger.error(`Token verification failed: ${err.name} - ${err.message}`, { error: err });
            // Clear cookie only if it was a cookie token
            if (req.cookies?.jwt && req.cookies.jwt === token) {
                res.clearCookie('jwt', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    path: '/',
                });
            }
            const errorMessage = err.name === 'TokenExpiredError' ? "Session expired. Please log in again." : "Invalid token.";
            // Use 401 for unauthorized, 403 implies insufficient permissions with a valid token
            return res.status(401).json({ error: errorMessage });
        }
        req.user = user;
        logger.info('Authentication successful. User:', user.id); // Log successful authentication
        next();
    });
};
