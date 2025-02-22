const express = require('express');
const router = express.Router();
const { register, signin, updateProfile, changeStatusUser, changeRole, listUsers, testApi, callProfile } = require('../controllers/userController');
const { validate_Email_Pwd, validate_Profile, validate_Status, validate_Role, validate_Images_size, validate_Signin } = require('../middlewares/pre-check-data');
const { jwtValidate, adminValidate } = require('../middlewares/authService');
const { upload } = require('../config/multerConfig');

router.post('/user/register', validate_Email_Pwd, register);
router.post('/user/signin', validate_Signin, signin);
// router.post('/user/signin', validate_Email_Pwd, signin);

router.put('/user/update-profile', jwtValidate, upload.array('image'), validate_Profile, validate_Images_size, updateProfile);
// router.get('/user/profile', jwtValidate, callProfile);

// admin
router.put('/user/change-status/:id', adminValidate, validate_Status, changeStatusUser);
router.put('/user/change-role/:id', adminValidate, validate_Role, changeRole);
router.get('/user/list-users/:statusby/:limit', adminValidate, listUsers);

// test
// router.post('/testapi/', upload.array('image'), validate_Images_size, testApi);

module.exports = router;