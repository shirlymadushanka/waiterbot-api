const Item = require('../models/Item');
const createHttpError = require('http-errors');

// check property middleware
module.exports = async (req,res,next) => {
    // this middleware check if user belongs that item.
    try {
        const user = await Item.findById(req.params.itemId).select("property").populate("property","owner -_id").populate("owner","_id");
        if(user.property.owner.toString() !== req.user.user_id) throw createHttpError.NotFound("Item not found!");
        next();
    } catch (error) {
        next(error);
    }
}