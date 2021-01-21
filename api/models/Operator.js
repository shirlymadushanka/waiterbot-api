const mongoose = require('mongoose');
const Base = require('./UserBase');

const Operator = Base.discriminator('Operator', new mongoose.Schema({
    work_on : { type : mongoose.SchemaTypes.ObjectId , ref: 'Property'}
})
);

module.exports = mongoose.model('Operator');