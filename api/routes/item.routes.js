const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
const validator = require('express-joi-validation').createValidator({ passError: true });
const schema = require('../utils/Validator');
const checkRole = require('../middlewares/checkRole');
const checkItem = require('../middlewares/checkItem');
const { uploader } = require('../middlewares/fileUpload');

// ? All routes start with /api/items goes here..

// get item by id
router.get('/:itemId',ItemController.readItem);

// only owners can access below routes
router.use(checkRole(["owner"]));

// edit item
router.patch(
    '/:itemId',
    checkItem,
    validator.body(schema.editItemSchema),
    ItemController.updateItem
);

// edit item
router.delete(
    '/:itemId',
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


module.exports = router;