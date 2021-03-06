const express = require('express');
const router = express.Router();
const checkRole =  require('../middlewares/checkRole');

// router level checkrole middleware
router.use(checkRole(["admin"]));

// get admin profile
router.get('/profile', (req, res,next) => {
    res.status(200).json({
        success : true,
        message : "admin profile dets"
    });
});


module.exports = router;

