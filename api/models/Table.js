const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Declare the Schema of the Mongo model

var tableSchema = new Schema({
    property: {
        type: mongoose.Types.ObjectId,
        ref: 'Property'
    },
    table_number : {
        type : String,
        required : true
    },
    junction : {
        type : Number,
        required : true
    },
    turn_direction : {
        type : String,
        enum : ['left','right'],
        default : 'left'
    }
},
    {
        timestamps: true
    }
);


//Export the model
module.exports = mongoose.model('Table', tableSchema);