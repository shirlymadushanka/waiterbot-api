const mongoose = require('mongoose');
const Base = require('./UserBase');

const Admin = Base.discriminator('Admin', new mongoose.Schema({
})
);

module.exports = mongoose.model('Admin');