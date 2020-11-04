const Joi = require('joi');


const userInputSchema = Joi.object({
    first_name : Joi.string().required(),
    last_name  : Joi.string().required(),
    mobile  : Joi.string().pattern(/^([+]\d{2})?\d{9}$/).required().error(()=> new Error("Please enter valid mobile number.Format +947xxxxxxxx")),
    password : Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().error(()=> new Error("Password must have atleast 8 characters including one upper case character,one lower case character, alphanumaric characters and one special character."))
});



const authSchema = Joi.object({
    mobile : Joi.string().required(),
    password  : Joi.string().required()
});

module.exports = {
    userInputSchema,
    authSchema
}