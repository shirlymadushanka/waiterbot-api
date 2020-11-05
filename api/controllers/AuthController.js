const createHttpError = require('http-errors');
const createErrors = require('http-errors');
const bcrypt =  require('bcrypt');
const jwt  =  require('jsonwebtoken');

const {authSchema, userInputSchema } = require('../utils/Validator')
const User = require('../models/User');
const { SECRET } = require('../config')

const userRegister = async (userData, role, req, res, next) => {
    try {
        // validate user data.
        const result = await userInputSchema.validate(userData);
        
        if(result.error) throw createErrors.UnprocessableEntity(result.error.message);
        // validate mobile
        let mobileExists = await validateMobile(result.value.mobile);
        if(mobileExists) throw createErrors.Conflict(`User already registed using this mobile number`)
        // hash the password
        const password = await bcrypt.hash(result.value.password, 12);

        // Create new user
        const newUser = User({
            ...result.value,
            password,
            role
        });
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

const userLogin = async (authCredintials, role,req,res,next) => {

    try {
        
        // extract username and password from user creadintials
        const result = await authSchema.validate(authCredintials);
        // it there is an error throw error
        if(result.error) throw createErrors.UnprocessableEntity(result.error.message);
        // check username in the database
        const user = await User.findOne({ mobile : result.value.mobile });

        if (!user) throw createErrors.Unauthorized("Invalid mobile or password.");

        // check role
        if (user.role !== role) {
            throw createErrors.Unauthorized("Invalid mobile or password.");
        }

        // check password
        let isMatch = await bcrypt.compare(result.value.password, user.password);
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
            role: user.role,
            token: token,
            expiresIn: "24"
        }

        res.status(200).json({
            ...data,
            message: `Login successful for the user ${user.mobile}`,
            success: true
        });

    } catch (err) {
        // if error is caught sent to the next middleware.
        next(err);
    }


}


const getAuthUser = async (req,res,next) => {

    try {
        const user = await User.findOne({ _id : req.user.user_id });
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
    let user = await User.findOne({ mobile });
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