const mongoose = require('mongoose');
const Owner = require('./Owner');
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model

var propertySchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Owner'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    imgUrl: {
        key: {
            type: String,
            default: null
        },
        location : {
            type : String,
            default : "https://via.placeholder.com/500?text=Image%20not%20available"
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
    stars: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    items: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
);

// add location index
propertySchema.index({ location: "2dsphere" });

// post remove callback
propertySchema.post('save', async function (doc) {
    await Owner.updateOne(
        { _id: doc.owner },
        { $push: { properties: doc._id } }
    );
});

// post remove callback
propertySchema.post('remove', async function (doc) {
    await Owner.updateOne(
        { _id: doc.owner },
        { $pull: { properties: doc._id } }
    );
});

//Export the model
module.exports = mongoose.model('Property', propertySchema);