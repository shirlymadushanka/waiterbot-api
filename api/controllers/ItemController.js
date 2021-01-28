const createHttpError = require('http-errors');
const Item = require('../models/Item');
const { s3Config } = require('../middlewares/fileUpload');


// Create Item
const createItem = async (req, res, next) => {
    try {
        const item = await new Item({
            ...req.body,
            property: req.params.propId
        }).save();
        res.status(201).json({
            data: serializedItem(item),
            message: `Item added successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

// update item
const updateItem = async (req, res, next) => {
    try {
        // update the document
        const item = await Item.findByIdAndUpdate(req.params.itemId, { ...req.body }, { new: true });
        res.status(200).json({
            data: serializedItem(item),
            message: `Item updated successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

// read item by id & get all items
const readItem = async (req, res, next) => {
    try {
        console.log(req.params.itemId);
        let data = await Item.findById(req.params.itemId);
        res.status(200).json({
            data: serializedItem(data),
            message: `Item fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

// read item by property
const readItemByPropId = async (req, res, next) => {
    try {
        const items = await Item.find({ property: req.params.propId });
        res.status(200).json({
            data: items.map(serializedItem),
            message: `Item fetched successfully.`,
            success: true
        });

    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        // check if user has right permissions to edit the resource.
        const user = await Item.findById(req.params.itemId).select("property").populate("property", "owner -_id").populate("owner", "_id");
        if (user.property.owner.toString() !== req.user.user_id) throw createHttpError.NotFound("Item not found!");
        // update the document
        const item = await Item.findById(req.params.itemId);
        await item.remove();
        res.status(200).json({
            data: {},
            message: `Item deleted successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

const addImage = async (req, res, next) => {
    try {
        if(req.file === undefined ) throw createErrors.UnprocessableEntity("image required!");
        const item = await Item.findByIdAndUpdate(req.params.itemId, {
            imgUrl: {
                key: req.file.key,
                location: req.file.location
            }
        }, { new: true });
        if (item === null) throw new Error("Something went wrong!");
        res.status(200).json({
            success: true,
            message: "image uploaded successfully.",
            data: {
                location: req.file.location
            }
        });
    } catch (error) {
        next(error);
    }
}

const removeImage = async (req, res, next) => {
    try {
        const resettedImageProps = {
            key: null,
            location: "https://via.placeholder.com/500?text=Image%20not%20available"
        }
        const item = await Item.findByIdAndUpdate(
            req.params.itemId,
            { imgUrl: resettedImageProps });
        if (item === null) throw new Error("Something went wrong!");
        // delete file from S3 bucket
        s3Config.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: item.imgUrl.key
        }, function (err, data) {
            if (err) {
                console.log("ERROR deleting file : ", err);
            }
        });

        res.status(200).json({
            success: true,
            message: "image removed successfully."
        });
    } catch (error) {
        next(error);
    }
}

const setAvailability = async ( req, res, next ) => {
    try {
        let status = req.body.available ? "available" : "sold-out";
        await Item.findByIdAndUpdate(req.params.itemId,{ status });
        res.status(200).json({
            success: true,
            message: "Item state has been changed successfully.",
            data: req.body
        });
    } catch (error) {
       next(error); 
    }
}

// helper function
const serializedItem = (item) => {
    if(item===null) return {};
    return {
        ...item._doc,
        imgUrl : item.imgUrl.location
    }

}

module.exports = {
    createItem,
    readItemByPropId,
    readItem,
    updateItem,
    deleteItem,
    addImage,
    removeImage,
    setAvailability
}