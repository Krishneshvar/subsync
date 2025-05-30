import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // If your backend relies on sending/receiving cookies (e.g., for sessions), uncomment this:
  // withCredentials: true,
});

// Add an interceptor to automatically attach the JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('subsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handles user login by sending credentials to the backend.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves with user data on success.
 * @throws {Error} - Throws an error if login fails.
 */
export const apiLoginUser = async (username, password) => {
  try {
    // Send credentials to the backend to authenticate the user
    const response = await api.post('/login/user', {
      username,
      password,
    });
    
    // The response should contain a token if authentication was successful
    const data = response.data;
    
    // Store the token if it exists (this will be used by the interceptor for future requests)
    if (data.token) {
      localStorage.setItem('subsync_token', data.token);
    }
    
    return data;
  } catch (error) {
    // Re-throw the error to be handled by the calling thunk (loginUser in authSlice)
    // Access `error.response?.data?.message` for backend specific error messages
    throw new Error(error.response?.data?.message || 'Failed to log in. Please try again.');
  }
};
