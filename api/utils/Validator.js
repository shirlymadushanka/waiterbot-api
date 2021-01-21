const Joi = require('joi-oid');
const mongoose = require('mongoose');

// user input validator schema
const registerInputSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    mobile: Joi.string().pattern(/^(07)\d{8}$/).required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
});

// auth data input validator schema
const authSchema = Joi.object({
    mobile: Joi.string().required(),
    password: Joi.string().required()
});

// property data input validator schema
const propertySchema = Joi.object({
    owner : Joi.objectId().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    img: Joi.any(),
    location: Joi.object({
        type: Joi.string(),
        coordinates: Joi.array()
    })
});
const editPropertySchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    address: Joi.string(),
    imgUrl: Joi.any(),
    location: Joi.object({
        type: Joi.string(),
        coordinates: Joi.array()
    })
});

const itemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    portions: Joi.array().items({
        name: Joi.string()
            .required(),
        price: Joi.number()
            .required(),
        note: Joi.string()
    }),
    ingredients : Joi.array().items({
        name: Joi.string()
            .required(),
        qty: Joi.number()
            .required()
    })

});

module.exports = {
    registerInputSchema,
    authSchema,
    propertySchema,
    editPropertySchema,
    itemSchema
}