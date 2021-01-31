const Item = require('../models/Item');
const createHttpError = require('http-errors');
const Operator = require('../models/Operator');
const ObjectId = require('mongodb').ObjectID;

// check property middleware
module.exports = async (req, res, next) => {
    // this middleware check wheather user can access that item.
    try {
        if(req.params.itemId === undefined || !ObjectId.isValid(req.params.itemId.toString())) throw createHttpError.NotFound("Item not found!");
        if (req.user.role === "operator") {
            const item = await Item.findById(req.params.itemId).select("property").populate("property", "_id");
            const user = await Operator.findById(req.user.user_id, "work_on -_id");

            if (item === null || user === null) throw createHttpError.NotFound("Item not found!");

            if (item.property._id.toString() !== user.work_on.toString()) throw createHttpError.NotFound("Item not found!");
        } else {
            const item = await Item.findById(req.params.itemId).select("property").populate("property", "owner -_id").populate("owner", "_id");
            if (item === null || item.property.owner.toString() !== req.user.user_id.toString()) throw createHttpError.NotFound("Item not found!");
        }

        next();
    } catch (error) {
        next(error);
    }
}