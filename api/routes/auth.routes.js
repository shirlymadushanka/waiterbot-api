const express = require('express');
const router = express.Router();

const { userRegister, userLogin, getAuthUser } = require('../controllers/AuthController');
const checkAuth = require('../middlewares/checkAuth');


// Admin registration
router.post('/admin_register', async (req, res,next) => {
    await userRegister(req.body, "admin",req, res,next);
});

// Admin login
router.post('/admin_login',async (req,res,next)=>{
    await userLogin(req.body, "admin",req,res,next);
});


// owner registration
router.post('/owner_register', async (req, res,next) => {
    await userRegister(req.body, "owner",req,res,next);
});
// owner login
router.post('/owner_login',async (req,res,next)=>{
    await userLogin(req.body, "owner",req,res,next);
});

// operator registration
router.post('/operator_register', async (req, res,next) => {
    await userRegister(req.body, "operator",req,res,next);
});

// operator login
router.post('/operator_login',async (req,res,next)=>{
    await userLogin(req.body, "operator",req,res,next);
});

// Client registration
router.post('/client_register', async (req, res,next) => {
    await userRegister(req.body, "client",req,res,next);
});

// Client login
router.post('/client_login',async (req,res,next)=>{
    await userLogin(req.body, "client",req,res,next);
});


// get authonticated user
router.get('/user',checkAuth,getAuthUser);


module.exports = router;