import express from 'express';
import { validateLogin } from '../controllers/loginController.js';
import { getCustomersController } from '../controllers/customerController.js';

const router = express.Router();

router.post('/login/user', validateLogin);
router.get('/all-customers', getCustomersController);

export default router;
