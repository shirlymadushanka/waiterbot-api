const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Declare the Schema of the Mongo model

var portion = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    note: {
        type: String
    }
}
);

var ingredients = new Schema({
    name : {
        type : String,
        required : true
    },
    qty : {
        type : String,
        required : true
    }
});

var itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category :{ 
        type: String,
        required : true
    },
    property :{ 
        type: mongoose.Types.ObjectId,
        ref : 'Property'
    },
    portions : [portion],
    review_count : {
        type : Number,
        default : 0
    },
    review : {
        type : mongoose.Types.ObjectId,
        ref : "ItemReview"
    },
    ingredients : [ingredients]

},
    {
        timestamps: true
    }
);

//Export the model
module.exports = mongoose.model('Item', itemSchema);