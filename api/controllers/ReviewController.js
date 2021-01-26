const createHttpError = require('http-errors');
const ItemReview = require('../models/ItemReview');




const createItemReview = async (req, res, next) => {
    try {
        if(req.params.itemId === undefined ) throw createHttpError.NotFound("Item not found!");
        const review = new ItemReview({
            item : req.params.itemId,
            by : req.user.user_id,
            ...req.body
        });
        await review.save();
        res.status(201).json({
            data: { ...req.body },
            message: `Review added successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }   
}

const readItemReview = async (req, res, next) => {
    try {
       const review = await ItemReview.findById(req.params.itemRevId);
       res.status(200).json({
            data: review,
            message: `Review fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error)
    }
}


const getReviewByItem = async (req, res, next ) => {
    try {
        if(req.params.itemId === undefined ) throw createHttpError.NotFound("Item not found!");
        const reviews = await ItemReview.find({ item : req.params.itemId });
        res.status(200).json({
            data: reviews,
            message: `Reviews fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

const updateItemReview = async (req, res, next) => {
    try {
        const review = await ItemReview.findById(req.params.itemRevId);
        if( review === null ) throw createHttpError.Forbidden("Invalid review ID!")
        if( review.by.toString() !== req.user.user_id ) throw createHttpError.Forbidden("You don't have right permissions to update this resource!")
        console.log(review);
        await review.remove();
        let { _id, by , item, comment,stars } = review;
        const newReview = new ItemReview({
            _id,
            by,
            item,
            stars,
            comment,
            ...req.body
        });
        await newReview.save();

        res.status(200).json({
            data: newReview,
            message: `Review updated successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}



module.exports = {
    createItemReview,
    readItemReview,
    getReviewByItem,
    updateItemReview
}