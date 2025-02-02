const express = require('express');
const router = express.Router();
const { jwtValidate, adminValidate } = require('../middlewares/authService');
const { createOrder, removeOrder, updateStatusOrder, confirmPayment, listOrders, listOrdersAdmin, updateOrder, testPaydate, testStripeRetrieve } = require('../controllers/orderController');

router.post('/order/create', jwtValidate, createOrder);
router.delete('/order/remove/:id', jwtValidate, removeOrder); // cancel order by user
router.put('/order/confirm-payment', jwtValidate, confirmPayment);
router.get('/order/list-orders/:limit', jwtValidate, listOrders);

// admin
router.put('/order/update-status/:id', adminValidate, updateStatusOrder);
router.get('/order/list-orders-admin/:limit', adminValidate, listOrdersAdmin);
router.put('/order/update/:id', adminValidate, updateOrder);

//test
// router.put('/test-paydate',testPaydate)
router.get('/test-stripe',testStripeRetrieve)

module.exports = router;