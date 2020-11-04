const mongoose = require('mongoose'); // Erase if already required
const Schema = mongoose.Schema;


// Declare the Schema of the Mongo model

var userSchema = new Schema({
    first_name : { 
        type : String, 
        required : true
    },

    last_name : { type : String, required : true},

    email :String,

    mobile : {
        type : String,
        required : true,
        unique : true
    },

    role : {
        type : String,
        default : "client",
        enum : ["client","owner","admin"]
    },

    password : {
        type : String,
        required : true
    }
});

//Export the model
module.exports = mongoose.model('User', userSchema);