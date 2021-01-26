const ObjectId = require('mongodb').ObjectID;
const createHttpError = require('http-errors');

// check IDs and filter only mongoose ids
module.exports = (req, res, next) => {
    try {
        const params = Object.values(req.params);
        if(params.some(param => !ObjectId.isValid(param))) throw createHttpError.NotFound("Invaid ID!");
        
        next();
    } catch (error) {
        next(error);
    }
}