const express = require('express');
const router = express.Router();
const validator = require('express-joi-validation').createValidator({ passError: true });
const OrderController = require('../controllers/OrderController');
const checkRole = require('../middlewares/checkRole');
const filterID = require('../middlewares/filterID');
const schema = require('../utils/Validator');

// ?    all routes begin with /api/orders goes here..


// get order
router.get(
    '/:orderId',
    filterID,
    OrderController.readOrder
);


// create order
router.post(
    '/', 
    checkRole(["client"]), 
    validator.body(schema.orderSchema), 
    OrderController.createOrder
);

module.exports = router;

