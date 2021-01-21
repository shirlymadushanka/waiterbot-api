const mongoose = require('mongoose');
const Base = require('./UserBase');

const Owner = Base.discriminator('Owner', new mongoose.Schema({
    properties: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Property' 
        }
    ]
})
);

module.exports = mongoose.model('Owner');