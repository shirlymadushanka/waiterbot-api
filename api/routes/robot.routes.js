const express = require('express');
const router = express.Router();
const validator = require('express-joi-validation').createValidator({ passError: true });
const RobotController = require('../controllers/RobotController');
const checkRole = require('../middlewares/checkRole');
const filterID = require('../middlewares/filterID');
const schema = require('../utils/Validator');

// ?    all routes begin with /api/robots goes here..


// get one robot
router.get(
    '/:robId', 
    checkRole(["owner","operator"]),
    filterID,
    RobotController.readRobot
);


// create properties
router.post(
    '/', 
    checkRole(["admin"]), 
    validator.body(schema.robotSchema), 
    RobotController.createRobot
);

// edit robot
router.patch(
    '/:robId', 
    checkRole(["operator"]),
    filterID,
    validator.body(schema.editRobotSchema), 
    RobotController.updateRobot
);

// delete robot
router.delete(
    '/:robId', 
    checkRole(["admin"]), 
    filterID,
    RobotController.removeRobot
);

module.exports = router;

