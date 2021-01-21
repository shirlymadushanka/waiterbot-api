const mongoose = require('mongoose');


const baseOptions = {
    discriminatorKey: 'userType',
    collection: 'users'
};

// base schema
const Base = mongoose.model('Base', new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: { type: String, required: true },

    email: String,

    mobile: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        default: "client",
        enum: ["client", "operator", "owner", "admin"]
    },
    password: {
        type: String,
        required: true
    }
}, baseOptions,
),
);
module.exports = mongoose.model('Base');
