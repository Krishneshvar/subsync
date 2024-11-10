import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { validateLogin } from '../controllers/loginController.js';

const router = express.Router();

router.post('/login/user', validateLogin);
router.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'This is protected data.' });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('session_cookie_name'); // Use the same name as defined in session config
        return res.status(200).json({ success: true });
    });
});

export default router;
