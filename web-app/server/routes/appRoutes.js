import express from 'express';
import multer from 'multer';
import { validateLogin } from '../controllers/loginController.js';
import { getCustomersController, createCustomer } from '../controllers/customerController.js';

const upload = multer();
const router = express.Router();

router.post('/login/user', validateLogin);
router.get('/all-customers', getCustomersController);
router.post('/add-customer', upload.single('pfp'), createCustomer);

export default router;
