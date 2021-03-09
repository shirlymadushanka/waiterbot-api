const createErrors = require('http-errors');
const Property = require("../models/Property");
const Operator = require("../models/Operator");
const { s3Config } = require('../middlewares/fileUpload');


// create property
const createProperty = async (req, res, next) => {
    try {
        // create property
        const newProperty = Property({
            owner: req.body.owner,
            ...req.body
        });
        await newProperty.save();
        res.status(201).json({
            data: serializedProperty(newProperty),
            message: `Property added successfully.`,
            success: true
        });
    } catch (error) {
        // if some error is caught. pass them to the next middleware
        next(error);
    }
}

// read properties
const readProperty = async (req, res, next) => {
    try {
        let data;
        if (req.params.propId === undefined) {
            data = await Property.find({}).populate('owner', 'first_name last_name -_id');
            data = data.map((prop)=>{
                return { 
                    ...serializedProperty(prop),
                    owner : prop.owner
                }
            });
        } else {
            data = await Property.findById(req.params.propId).populate('owner', 'first_name last_name -_id');
            if(data === null ) throw createErrors.NotFound("Property not found!");
            data = {
                ...serializedProperty(data),
                owner : data.owner
            }
        }
        res.status(200).json({
            data: data,
            message: `Properties fetched successfully.`,
            success: true
        });
    } catch (error) {
        // if some error is caught. pass them to the next middleware
        next(error);
    }
}


// update property
const updateProperty = async (req, res, next) => {
    try {
        // check wheather user has access to that property.
        const property = await Property.findOneAndUpdate({ _id: req.params.propId, owner: req.user.user_id }, { ...req.body }, { new: true });
        res.status(200).json({
            data: serializedProperty(property),
            message: `Property updated successfully.`,
            success: true
        });
    } catch (error) {
        // if any error was catched, pass it to next middleware.
        next(error);
    }
}

// delete property
const deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById({ _id: req.params.propId });
        let key = property.imgUrl.key;
        s3Config.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        }, function (err, data) {
            if (err) {
                console.log("ERROR deleting file : ", err);
            }
        });
        property.remove();
        // return the response.
        res.status(200).json({
            data: {
                _id : property._id
            },
            message: `Property deleted successfully.`,
            success: true
        });
    } catch (error) {
        // if any error was catched, pass it to next middleware.
        next(error);
    }
}

// add image to property
// const propData = JSON.parse(JSON.stringify(req.body));

const addImage = async (req, res, next) => {
    try {
        if(req.file === undefined ) throw createErrors.UnprocessableEntity("image required!")
        const property = await Property.findOneAndUpdate(
            { _id: req.params.propId, owner: req.user.user_id },
            {
                imgUrl: {
                    key: req.file.key,
                    location: req.file.location
                }
            },
            { new: true });
        if (property === null) throw new Error("Something went wrong!");
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
        const property = await Property.findOneAndUpdate(
            { _id: req.params.propId, owner: req.user.user_id },
            { imgUrl: resettedImageProps });
        if (property === null) throw new Error("Something went wrong!");
        // delete file from S3 bucket
        s3Config.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: property.imgUrl.key
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

// helper function
const serializedProperty = (prop) => {
    if (prop === null) return {};
    
    return {
        "_id": prop._id,
        "name": prop.name,
        "description": prop.description,
        "address": prop.address,
        "location": prop.location,
        "imgUrl": prop.imgUrl.location,
    }
}


// export modules
module.exports = {
    createProperty,
    readProperty,
    updateProperty,
    deleteProperty,
    addImage,
    removeImage
}