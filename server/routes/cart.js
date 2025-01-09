const express = require('express');
const router = express.Router();
const { jwtValidate } = require('../middlewares/authService');
const { addToCart, listCart, removeFromCart } = require('../controllers/cartController');

router.post('/cart', jwtValidate, addToCart);
router.get('/cart/:id', jwtValidate, removeFromCart);
router.get('/cart/list', jwtValidate, listCart);

module.exports = router;