const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Declare the Schema of the Mongo model

var orderSchema = new Schema({
    status : {
        type: String,
        enum: ['Pending','Cancelled','Prepairing','Delivering','Delivered'],
        default: 'Pending'
    },
    property: {
        type: mongoose.Types.ObjectId,
        ref: 'Property'
    },
    user : {
        type: mongoose.Types.ObjectId,
        ref: 'Client'
    },
    amount : {
        type : Number,
        required : true
    },
    table : {
        type: mongoose.Types.ObjectId,
        ref: 'Table'
    },
    items : [
        {
            item : {
                type: mongoose.Types.ObjectId,
                ref: 'Item'
            },
            portion : {
                type : mongoose.Types.ObjectId
            },
            qty : {
                type : Number
            }
        }
    ]


},
    {
        timestamps: true
    }
);

orderSchema.post('save',(doc)=>{
    console.log(doc);
});


//Export the model
module.exports = mongoose.model('Order', orderSchema);