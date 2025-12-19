import { Router } from 'express';
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', ensureAuth, (req, res) => {
    res.json({
        displayName: req.user.displayName,
        email: req.user.email,
        photo: req.user.photo
    });
});

export default router;