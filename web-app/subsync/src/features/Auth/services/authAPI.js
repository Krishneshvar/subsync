import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // If your backend relies on sending/receiving cookies (e.g., for sessions), uncomment this:
  // withCredentials: true,
});

// When you implement JWTs, you'll need to re-add an interceptor here
// to attach the token to outgoing requests after a user logs in.

/**
 * Handles user login by sending credentials to the backend.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves with user data on success.
 * @throws {Error} - Throws an error if login fails.
 */
export const apiLoginUser = async (username, password) => {
  try {
    // Assuming your backend returns user data directly on successful login.
    // If your backend will eventually return a JWT, the response.data might contain
    // { user: { ... }, token: '...' }
    const response = await api.post('/login/user', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    // Re-throw the error to be handled by the calling thunk (loginUser in authSlice)
    // Access `error.response?.data?.message` for backend specific error messages
    throw new Error(error.response?.data?.message || 'Failed to log in. Please try again.');
  }
};
