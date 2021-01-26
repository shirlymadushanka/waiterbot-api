const mongoose = require('mongoose');
const Item = require('./Item');
const Schema = mongoose.Schema;


// Declare the Schema of the Mongo model

var itemReviewSchema = new Schema({

    by: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    item : {
        type: mongoose.Types.ObjectId,
        ref: 'Item'
    },
    stars : {
        type: Number,
        required : true
    },
    comment : {
        type : String,
        required : true
    }

},
    {
        timestamps: true
    }
);


itemReviewSchema.post('save', async function (doc) {
    await Item.findByIdAndUpdate(doc.item,{
        $inc: { review_count : 1, stars : doc.stars }
    })
});

itemReviewSchema.post('remove', async function (doc) {
    await Item.findByIdAndUpdate(doc.item,{
        $inc: { review_count : -1, stars : -doc.stars }
    })
});

//Export the model
module.exports = mongoose.model('ItemReview', itemReviewSchema);