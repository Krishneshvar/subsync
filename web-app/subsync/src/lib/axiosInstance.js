import axios from 'axios';
import { toast } from 'react-toastify';
import { store } from '@/app/store.js';
import { setGlobalLoading } from '@/app/appSlice.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  store.dispatch(setGlobalLoading(true));
  return config;
}, (error) => {
  store.dispatch(setGlobalLoading(false));
  console.error("Axios request error:", error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    store.dispatch(setGlobalLoading(false));
    return response;
  },
  (error) => {
    store.dispatch(setGlobalLoading(false));
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        console.error('Unauthorized access. Redirecting to login...');
        window.location.href = '/';
        toast.error("Your session has expired. Please log in again!");
      }
      else if (status === 403) {
        console.error('Access forbidden:', data.message);
        toast.error(data.message || "You don't have permission to perform this action.");
      }
      else if (status === 422 && data.errors) {
        console.error('Validation errors:', data.errors);
        toast.error(data.message || "Please correct the highlighted errors.");
        error.validationErrors = data.errors;
      }
      else if (status >= 400 && status < 500) {
        console.error(`Client error (${status}):`, data.message);
        toast.error(data.message || `Error: ${status} - Something went wrong.`);
      }
      else if (status >= 500) {
        console.error(`Server error (${status}):`, data.message || error.message);
        toast.error("A server error occurred. Please try again later.");
      }
    } else {
      console.error('Axios network error:', error.message);
      toast.error("Network error: Please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

export default api;
