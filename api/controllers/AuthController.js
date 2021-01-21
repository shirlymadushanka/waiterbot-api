const createErrors = require('http-errors');
const bcrypt =  require('bcrypt');
const jwt  =  require('jsonwebtoken');
const { SECRET } = require('../config');
const Owner = require('../models/Owner');
const Admin = require('../models/Admin');
const Operator = require('../models/Operator');
const Client = require('../models/Client');
const UserBase = require('../models/UserBase');

const userRegister = async (role, req, res, next) => {
    try {
        // validate mobile
        let mobileExists = await validateMobile(req.body.mobile);
        if(mobileExists) throw createErrors.Conflict(`User already registed using this mobile number`)
        // hash the password
        const password = await bcrypt.hash(req.body.password, 12);

        // Create new user
        let newUser;

        // if user is owner, create owner data
        if(role==="admin"){
            newUser = Admin({
                ...req.body,
                password,
                role
            });
        } else if (role === "owner"){
            newUser = Owner({
                ...req.body,
                password,
                role
            });
        }else if (role === "operator"){
            newUser = Operator({
                ...req.body,
                password,
                role
            });
        }else {
            newUser = Client({
                ...req.body,
                password,
                role
            });
        }
        await newUser.save();
        // send response
        res.status(201).json({
            message: `${role} created successfully.`,
            success: true,
            data : serializedUser(newUser)
        });
    } catch (error) {
        // if some error is caught. pass them to the next middleware
        next(error);
    }
}

const userLogin = async (role,req,res,next) => {

    try {
        // check username in the database
        const user = await UserBase.findOne({ mobile : req.body.mobile });

        if (!user) throw createErrors.Unauthorized("Invalid mobile or password.");

        // check role
        if (user.role !== role) {
            throw createErrors.Unauthorized("Invalid mobile or password.");
        }

        // check password
        let isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch) throw createErrors.Unauthorized("Invalid mobile or password.");
        
        // sign in the user and send a token
        let token = jwt.sign(
            {
                user_id: user._id,
                role: user.role
            },
            SECRET,
            { expiresIn: '1d' }
        );

        let data = {
            first_name: user.first_name,
            last_name : user.last_name,
            role: user.role
        }

        res.status(200).json({
            data,
            message: `Login successful for the user ${user.mobile}`,
            success: true,
            token: token,
            expiresIn: "24"
        });

    } catch (err) {
        // if error is caught sent to the next middleware.
        next(err);
    }


}


const getAuthUser = async (req,res,next) => {

    try {
        const user = await UserBase.findOne({ _id : req.user.user_id });
        let data = {
            first_name : user.first_name,
            last_name : user.last_name,
            role : user.role
        }
        res.status(200).json({
            ...data,
            success: true
        });

    } catch (err) {
        // if error is caught sent to the next middleware.
        next(err);
    }


}


// validate a given mobile
const validateMobile = async mobile => {
    let user = await UserBase.findOne({ mobile });
    return user ? true : false;
}

// serialized user
const serializedUser = user => {
    return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        mobile : user.mobile,
        role : user.role
    }
}

module.exports = {
    userRegister,
    userLogin,
    getAuthUser
}