const createErrors = require('http-errors');
const Item = require('../models/Item')



const createItem = (req, res, next) => {
    try {
        // check wheather user has access to that property.
        const property = await Property.findOne({_id : req.params.id,owner : req.user.user_id});
        if(property === null) throw createErrors.NotFound("Property not found!");
        // create Item
        
        res.status(201).json({
            data: null,
            message: `Item added successfully.`,
            success: true
        });
    } catch (error) {
        // if some error is caught. pass them to the next middleware
        next(error);
    }
}