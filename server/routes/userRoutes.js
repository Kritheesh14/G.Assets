// server/routes/userRoutes.js
const express = require('express');
const auth = require('../middleware/authMiddleware.js');
const { getMe, updateMe } = require('../controllers/userController.js');

const router = express.Router();

// current user profile
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

module.exports = router;
