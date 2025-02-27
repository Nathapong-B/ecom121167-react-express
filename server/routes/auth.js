const express = require('express');
const router = express.Router();
const { refreshToken } = require('../controllers/authController');
const { jwtRefreshValidate } = require('../middlewares/authService');

// header : ref_token
router.post('/refresh-token', jwtRefreshValidate, refreshToken);

module.exports = router;