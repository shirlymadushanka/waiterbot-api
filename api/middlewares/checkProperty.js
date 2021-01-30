const Property = require('../models/Property');
const Operator = require('../models/Operator');
const createHttpError = require('http-errors');
const ObjectId = require('mongodb').ObjectID;

// check property middleware
module.exports = async (req,res,next) => {
    // this middleware check if user belongs that property.
    try {
        if(req.params.propId === undefined || !ObjectId.isValid(req.params.propId)) throw createHttpError.NotFound("Property not found!");
        const property = await Property.findById({_id : req.params.propId});
        if( property === null ) throw createHttpError.NotFound("Property not found!");
        if(req.user.role === "operator"){
            const user = await Operator.findById(req.user.user_id,"work_on -_id");
            if( property._id.toString() !== user.work_on.toString() ) throw createHttpError.NotFound("Item not found!");
        }else {
            if(property.owner.toString() !== req.user.user_id) throw createHttpError.NotFound("Property not found!");
        }
        next();
    } catch (error) {
        next(error);
    }
}