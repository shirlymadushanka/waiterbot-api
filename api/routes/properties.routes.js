const express = require('express');
const PropertyController = require('../controllers/PropertyController');
const ItemController = require('../controllers/ItemController');
const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const checkProperty = require('../middlewares/checkProperty');
const { uploader } = require('../middlewares/fileUpload');
const validator = require('express-joi-validation').createValidator({ passError: true });
const schema = require('../utils/Validator');



// ?    all routes begin with /api/properties goes here..

// get properties
router.get('/', PropertyController.readProperty);
// get one property
router.get('/:propId', PropertyController.readProperty);


// create properties
router.post(
    '/', 
    checkRole(["admin"]), 
    validator.body(schema.propertySchema), 
    PropertyController.createProperty
);

// edit property
router.patch(
    '/:propId', 
    checkRole(["owner"]), 
    checkProperty,
    validator.body(schema.editPropertySchema), 
    PropertyController.updateProperty
);

// delete property
router.delete(
    '/:propId', 
    checkRole(["admin"]), 
    PropertyController.deleteProperty
);


// add image to a property
router.post(
    '/:propId/image', 
    checkRole(["owner"]), 
    checkProperty,
    uploader.single('image'),
    PropertyController.addImage
);

// remove image from a property
router.delete(
    '/:propId/image', 
    checkRole(["owner"]), 
    checkProperty,
    PropertyController.removeImage
);

// add items to a property
router.post(
    '/:propId/items',
    checkRole(["owner"]), 
    checkProperty, 
    validator.body(schema.itemSchema), 
    ItemController.createItem
);

// read registed items in the property
router.get(
    '/:propId/items', 
    checkProperty,
    ItemController.readItemByPropId
);



module.exports = router;

