const Property = require('../models/Property');
const createHttpError = require('http-errors');

// check property middleware
module.exports = async (req,res,next) => {
    // this middleware check if user belongs that property.
    try {
        const property = await Property.findById({_id : req.params.propId});
        if(property === null || property.owner.toString() !== req.user.user_id) throw createHttpError.NotFound("Property not found!");
        next();
    } catch (error) {
        next(error);
    }
}