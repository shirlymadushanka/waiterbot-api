const express = require('express');
const router = express.Router();
const validator = require('express-joi-validation').createValidator({passError: true});
const { userRegister, userLogin, getAuthUser } = require('../controllers/AuthController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');
const {authSchema, registerInputSchema,operatorRegisterInputSchema } = require('../utils/Validator');


// Admin registration
router.post('/admin_register',validator.body(registerInputSchema), async (req, res,next) => {
    await userRegister("admin",req, res,next);
});

// Admin login
router.post('/admin_login',validator.body(authSchema),async (req,res,next)=>{
    await userLogin("admin",req,res,next);
});


// owner registration
router.post('/owner_register',checkAuth,checkRole(["admin"]),validator.body(registerInputSchema), async (req, res,next) => {
    await userRegister("owner",req,res,next);
});

// owner login
router.post('/owner_login',validator.body(authSchema),async (req,res,next)=>{
    await userLogin("owner",req,res,next);
});

// operator registration
router.post('/operator_register',checkAuth,checkRole(["owner"]),validator.body(operatorRegisterInputSchema), async (req, res,next) => {
    await userRegister("operator",req,res,next);
});

// operator login
router.post('/operator_login',validator.body(authSchema),async (req,res,next)=>{
    await userLogin("operator",req,res,next);
});

// Client registration
router.post('/client_register',validator.body(registerInputSchema), async (req, res,next) => {
    await userRegister("client",req,res,next);
});

// Client login
router.post('/client_login',validator.body(authSchema),async (req,res,next)=>{
    await userLogin("client",req,res,next);
});

// get authonticated user
router.get('/user',checkAuth,getAuthUser);


module.exports = router;