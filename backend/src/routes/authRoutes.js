const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticateJWT, authController.getMe);
router.put('/change-password', authenticateJWT, authController.changePassword);

module.exports = router;

