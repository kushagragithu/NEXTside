import { Router } from 'express';
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'public/profile.html'));
});

router.get('/profile/data', ensureAuth, (req, res) => {
    res.json({
        displayName: req.user.displayName,
        email: req.user.email,
        photo: req.user.photo
    });
});

router.get('/dashboard', ensureAuth, (req, res) => {
    res.json({
        
    })
})

export default router;