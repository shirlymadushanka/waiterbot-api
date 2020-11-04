const express = require('express');
const router = express.Router();



// get admin profile
router.get('/profile', async (req, res,next) => {
    res.status(200).json({
        success : true,
        message : "admin profile dets"
    });
});


module.exports = router;

