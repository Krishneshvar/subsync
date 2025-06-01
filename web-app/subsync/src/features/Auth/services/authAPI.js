import api from '@/lib/axiosInstance';

/**
 * Handles user login by sending credentials to the backend.
 * Stores the received authentication token in local storage upon successful login.
 *
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves with user data (including token) on success.
 * @throws {Error} Throws an error if the login request fails, with a user-friendly message.
 */
const apiLoginUser = async (username, password) => {
  try {
    const response = await api.post('/login/user', {
      username,
      password,
    });

    const data = response.data;

    // If a token is present in the response, store it in local storage
    if (data.token) {
      localStorage.setItem('subsync_token', data.token);
    }

    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to log in. Please try again.');
  }
};

export { apiLoginUser };
