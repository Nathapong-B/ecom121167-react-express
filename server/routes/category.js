const express = require('express');
const router = express.Router();
const { addCategory, updateCategory, changeStatusCategory, listCategory, removeCategory } = require('../controllers/categoryController');
const { adminValidate } = require('../middlewares/authService');
const { validate_Status } = require('../middlewares/pre-check-data');

router.get('/category/list', listCategory);

// admin
router.post('/category/add', adminValidate, addCategory);
router.put('/category/update/:id', adminValidate, updateCategory);
router.put('/category/change-status/:id', adminValidate, validate_Status, changeStatusCategory);
router.get('/category/list/:statusby', adminValidate, listCategory);
router.delete('/category/remove/:id', adminValidate, removeCategory);

module.exports = router;