const express = require('express');
const router = express.Router();
const validator = require('express-joi-validation').createValidator({ passError: true });
const schema = require('../utils/Validator');
const filterID = require('../middlewares/filterID');
const ReviewController = require('../controllers/ReviewController');



// ? All routes start with /api/items goes here..

// get item by id
router.get('/:itemRevId', ReviewController.readItemReview);


// edit item
router.patch(
    '/:itemRevId',
    filterID,
    validator.body(schema.editReviewSchema),
    ReviewController.updateItemReview
);



module.exports = router;