const mongoose = require('mongoose');
const Base = require('./UserBase');

const Client = Base.discriminator('Client', new mongoose.Schema({
    past_ordered : []
})
);



module.exports = mongoose.model('Client');