const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
const ReviewController = require('../controllers/ReviewController');
const validator = require('express-joi-validation').createValidator({ passError: true });
const schema = require('../utils/Validator');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');
const checkItem = require('../middlewares/checkItem');
const filterID = require('../middlewares/filterID');
const { uploader } = require('../middlewares/fileUpload');
const Joi = require('joi-oid');

// ? All routes start with /api/items goes here..

// get item by id
router.get('/:itemId', ItemController.readItem);
// get all reviews
router.get(
    '/:itemId/reviews',
    filterID,
    ReviewController.getReviewByItem
);

router.use(checkAuth);

// edit item
router.patch(
    '/:itemId',
    checkRole(["owner"]),
    checkItem,
    validator.body(schema.editItemSchema),
    ItemController.updateItem
);

// edit item
router.delete(
    '/:itemId',
    checkRole(["owner"]),
    checkItem,
    ItemController.deleteItem
);

// add image to a property
router.post(
    '/:itemId/image',
    checkRole(["owner"]),
    checkItem,
    uploader.single('image'),
    ItemController.addImage
);

// remove image from a property
router.delete(
    '/:itemId/image',
    checkRole(["owner"]),
    checkItem,
    ItemController.removeImage
);

// change state of a item [ available or not-available]
router.patch(
    '/:itemId/setAvailability',
    checkRole(["operator"]),
    checkItem,
    validator.body(Joi.object({
        available: Joi.boolean().strict().required(),
    })),
    ItemController.setAvailability
);

// add item reviews
router.post(
    '/:itemId/reviews',
    filterID,
    validator.body(schema.reviewSchema),
    ReviewController.createItemReview
);


module.exports = router;