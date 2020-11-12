const express = require('express');
const router = express.Router();
const checkRole =  require('../middlewares/checkRole');

// router level checkrole middleware
router.use(checkRole(["owner"]));

// get owner profile
router.get('/profile', async (req, res,next) => {
    res.status(200).json({
        success : true,
        message : "owner profile dets"
    });
});


module.exports = router;

