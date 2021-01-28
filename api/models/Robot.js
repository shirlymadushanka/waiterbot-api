const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Declare the Schema of the Mongo model

var robotSchema = new Schema({
    nickname : {
        type : String,
    },
    status : {
        type: String,
        enum: ['Idle','Assigned','Delivering','Delivered'],
        default: 'Idle'
    },
    table : {
        type: mongoose.Types.ObjectId,
        ref: 'Table'
    },
    property: {
        type: mongoose.Types.ObjectId,
        ref: 'Property'
    }

},
    {
        timestamps: true
    }
);


//Export the model
module.exports = mongoose.model('Robot', robotSchema);