const createHttpError = require('http-errors');
const Order = require('../models/Order');


const createOrder = async (req, res, next) => {
    try {
        
        res.status(201).json({
            data: { ...req.body },
            message: `Review added successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }   
}

const readOrder = async (req, res, next) => {
    try {
       
       res.status(200).json({
            data: review,
            message: `Review fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error)
    }
}


const getOrdersByUserId = async (req, res, next ) => {
    try {
       
        res.status(200).json({
            data: reviews,
            message: `Reviews fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    try {
      
        

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
    createOrder,
    readOrder,
    getOrdersByUserId,
    updateOrder
}