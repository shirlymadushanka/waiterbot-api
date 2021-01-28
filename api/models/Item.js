const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Declare the Schema of the Mongo model

var itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    property: {
        type: mongoose.Types.ObjectId,
        ref: 'Property'
    },
    portions: [
        {
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
    ],
    review_count: {
        type: Number,
        default: 0
    },
    stars: {
        type: Number,
        default: 0
    },
    ingredients: [String],
    status: {
        type: String,
        enum: ['available', 'sold-out'],
        default: 'available'
    },
    imgUrl: {
        key: {
            type: String,
            default: null
        },
        location: {
            type: String,
            default: "https://via.placeholder.com/500?text=Image%20not%20available"
        }
    }

},
    {
        timestamps: true
    }
);

// post remove callback
// ? Here we have to remove all related documents of that item. All the comments, ratings, past orders etc.

itemSchema.post('remove', async function (doc) {
    // TODO remove all related documents here...
});

//Export the model
module.exports = mongoose.model('Item', itemSchema);