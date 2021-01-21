const express = require('express');
const PropertyController = require('../controllers/PropertyController');
const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const checkProperty = require('../middlewares/checkProperty');
const { uploader } = require('../middlewares/fileUpload');
const validator = require('express-joi-validation').createValidator({ passError: true });
const { propertySchema, editPropertySchema, itemSchema } = require('../utils/Validator');


// all routes begin with /api/properties goes here..

// get properties
router.get('/', PropertyController.readProperty);
// get one property
router.get('/:propId', PropertyController.readProperty);


// create properties
router.post(
    '/', 
    checkRole(["admin"]), 
    validator.body(propertySchema), 
    PropertyController.createProperty
);

// edit property
router.patch(
    '/:propId', 
    checkRole(["owner"]), 
    validator.body(editPropertySchema), 
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
router.post('/:propId/items', validator.body(itemSchema), (req, res, next) => {
    res.json(req.body);
})



module.exports = router;

