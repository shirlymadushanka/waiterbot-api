const Joi = require('joi-oid');

// user input validator schema
const registerInputSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    mobile: Joi.string().pattern(/^(07)\d{8}$/).required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
});
// operator register schema
const operatorRegisterInputSchema = Joi.object({
    work_on: Joi.objectId().required(),
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
    owner: Joi.objectId().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    img: Joi.any(),
    location: Joi.object({
        type: Joi.string(),
        coordinates: Joi.array()
    })
});
// edit property data input validator schema
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

// item data input validator schema
const itemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string().required(),
    portions: Joi.array().items({
        name: Joi.string()
            .required(),
        price: Joi.number()
            .required(),
        note: Joi.string()
    }).min(1).required(),
    ingredients: Joi.array().items(Joi.string())

});

// edit item data input validator schema
const editItemSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    portions: Joi.array().items({
        name: Joi.string(),
        price: Joi.number(),
        note: Joi.string()
    }).min(1),
    ingredients: Joi.array().items(Joi.string())

});

// robot data validator schema
const robotSchema = Joi.object({
    property: Joi.objectId().required()
});

// edit robot data validator schema
const editRobotSchema = Joi.object({
    status: Joi.string().valid('Idle', 'Assigned', 'Delivering', 'Delivered').required(),
    table: Joi.objectId()
});

// review data validator schema
const reviewSchema = Joi.object({
    stars: Joi.number().integer().strict().min(0).max(5).required(),
    comment: Joi.string().required()
});

// edit review data validator schema
const editReviewSchema = Joi.object({
    stars: Joi.number().integer().strict().min(0).max(5),
    comment: Joi.string()
});

// Table data schema
const tableSchema = Joi.object({
    table_number: Joi.number().integer().strict().min(0).required(),
    junction: Joi.number().integer().strict().min(0).required(),
    turn_direction: Joi.string().valid('left', 'right').required()
});
// Edit Table data schema
const editTableSchema = Joi.object({
    table_number: Joi.number().integer().strict().min(0),
    junction: Joi.number().integer().strict().min(0),
    turn_direction: Joi.string().valid('left', 'right')
});

// Order data schema
const orderSchema = Joi.object({
    property: Joi.objectId().required(),
    amount: Joi.number().required(),
    table: Joi.objectId().required(),
    items: Joi.array().items({
        item : Joi.objectId().required(),
        portion: Joi.objectId().required(),
        qty: Joi.number().integer().strict().required()
    }).min(1)
});

module.exports = {
    registerInputSchema,
    operatorRegisterInputSchema,
    authSchema,
    propertySchema,
    editPropertySchema,
    itemSchema,
    editItemSchema,
    robotSchema,
    editRobotSchema,
    reviewSchema,
    editReviewSchema,
    tableSchema,
    editTableSchema,
    orderSchema
}