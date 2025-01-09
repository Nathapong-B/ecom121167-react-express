const express = require('express');
const router = express.Router();
const { register, signin, updateProfile, changeStatusUser, changeRole } = require('../controllers/userController');
const { validate_Email_Pwd, validate_Profile, validate_Status, validate_Role } = require('../middlewares/pre-check-data');
const { jwtValidate, adminValidate } = require('../middlewares/authService');

router.post('/user/register', validate_Email_Pwd, register);
router.post('/user/signin', validate_Email_Pwd, signin);

router.put('/user/update-profile', jwtValidate, validate_Profile, updateProfile);

// admin
router.put('/user/change-status/:id', adminValidate, validate_Status, changeStatusUser);
router.put('/user/change-role/:id', adminValidate, validate_Role, changeRole);

module.exports = router;