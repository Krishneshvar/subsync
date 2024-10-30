import express from 'express';
import { validateLogin } from '../controllers/loginController.js';

const router = express.Router();

router.post('/user-login', validateLogin);

export default router;
