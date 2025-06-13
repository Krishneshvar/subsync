import redisClient from '../config/redisClient.js';

/**
 * Adds a JWT to the blacklist in Redis.
 * The token will expire from the blacklist at the same time it would naturally expire.
 * @param {string} token The JWT to blacklist.
 * @param {number} expiresIn The expiration time of the token in seconds.
 */
export const addTokenToBlacklist = async (token, expiresIn) => {
    try {
        await redisClient.setex(token, expiresIn, 'blacklisted');
        console.log(`Token blacklisted: ${token.substring(0, 20)}... for ${expiresIn} seconds.`);
    } catch (error) {
        console.error('Error adding token to blacklist:', error);
    }
};

/**
 * Checks if a JWT is present in the blacklist.
 * @param {string} token The JWT to check.
 * @returns {Promise<boolean>} True if the token is blacklisted, false otherwise.
 */
export const isTokenBlacklisted = async (token) => {
    try {
        const exists = await redisClient.exists(token);
        return exists === 1;
    } catch (error) {
        console.error('Error checking token blacklist:', error);
        return true;
    }
};
