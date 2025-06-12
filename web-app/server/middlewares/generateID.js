import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique ID using UUID v4.
 * @returns {string} - UUID string.
 */
export const generateID = () => {
  return uuidv4();
};
