const Property = require('../models/Property');

// check property middleware
module.exports = async (req,res,next) => {
    // this middleware check if user belongs that property.
    console.log(req.params);
    try {
        const property = await Property.findById({_id : req.params.propId});
        console.log(property);
        if(property === null || property.owner.toString() !== req.user.user_id) throw createErrors.NotFound("Property not found!");
        next();
    } catch (error) {
        next(error);
    }
}