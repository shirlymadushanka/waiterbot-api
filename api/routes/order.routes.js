const express = require('express');
const router = express.Router();
const validator = require('express-joi-validation').createValidator({ passError: true });
const OrderController = require('../controllers/OrderController');
const checkAuth = require('../middlewares/checkAuth');
const allowGuest = require('../middlewares/allowGuest');
const checkRole = require('../middlewares/checkRole');
const filterID = require('../middlewares/filterID');
const schema = require('../utils/Validator');
const Joi = require('joi-oid');

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
    allowGuest,
    validator.body(schema.orderSchema), 
    OrderController.createOrder
);

router.use(checkAuth);

// set order state
router.patch(
    '/:orderId',
    validator.query(
        Joi.object({
            status : Joi.string().valid('Pending','Cancelled','Preparing','Delivering','Delivered').required(),
            robotId: Joi.when('status', {
                is: "Delivering",
                then: Joi.objectId().required(),
                otherwise: Joi.optional()
            }),
        })
    ),
    checkRole(["operator"]),
    filterID,
    OrderController.updateOrder
);



module.exports = router;

