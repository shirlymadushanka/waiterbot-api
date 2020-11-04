const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');
const createErrors = require('http-errors');
const User = require('../models/User')

module.exports = async (req, res, next) => {
    try {
        // check if the token is there in header
        if(!req.headers.authorization) throw createErrors.Unauthorized("Unauthorized! Please login to proceed.");
        // extract token from request header.
        const token = req.headers.authorization.split(" ")[1];
        // verify and decode token
        const decodedPayload =  jwt.verify(token,SECRET);
        // set request body
        req.user = decodedPayload;
        // get user form the database
        const user = await User.findOne({ _id : decodedPayload.user_id });
        if(!user) throw createErrors.Unauthorized("Unauthorized! Please login to proceed.");
        
        next();
        
    } catch (err) {
        err.status = err.status || 401;
        next(err);
    }
}