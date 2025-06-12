import { toast } from 'react-toastify';

const errorMiddleware = store => next => action => {
    try {
        const result = next(action);
        return result;
    } catch (error) {
        console.error('Caught an error in Redux middleware:', error);

        // Show a global toast notification for Redux-level errors
        toast.error(error.message || 'An unexpected error occurred within the app state!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        // Re-throw the error so it can still be caught by other error boundaries if needed
        throw error;
    }
};

export default errorMiddleware;
