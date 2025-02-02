const express = require('express');
const router = express.Router();
const { listProducts, addProduct, updateProduct, changeStatusProduct, getEachProduct, searchProduct, listProductBy, removeProduct, testApi, listInactiveProducts, callProductsByList } = require('../controllers/productController');
const { adminValidate } = require('../middlewares/authService');
const { validate_Product_data, validate_Status, validate_Images, validate_Images_size } = require('../middlewares/pre-check-data');
const { upload } = require('../config/multerConfig');

// admin
router.post('/product/add', adminValidate, upload.array('images'), validate_Product_data, validate_Images, addProduct);
router.put('/product/update/:id', adminValidate, upload.array('images'), validate_Product_data, validate_Images_size, updateProduct);
router.put('/product/change-status/:id', adminValidate, validate_Status, changeStatusProduct);
router.delete('/product/remove/:id', adminValidate, removeProduct);
router.get('/product/inactive/:limit', adminValidate, listInactiveProducts);

router.get('/product/:limit', listProducts);
router.get('/product/each/:id', getEachProduct);
router.post('/product/search', searchProduct);
router.get('/product/:limit/:sort', listProductBy);
router.post('/product/list-by-list', callProductsByList);



// router.get('/product/:limit/:skip/:cursor', listProducts); // test

// test
// router.post('/testapi/', testApi);

module.exports = router;