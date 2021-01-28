const createHttpError = require('http-errors');
const Order = require('../models/Order');
const Table = require('../models/Table');
const Property = require('../models/Property');
const Operator = require('../models/Operator');


const createOrder = async (req, res, next) => {
    try {
        const property = await Property.findById(req.body.property);
        if( property === null ) throw createHttpError.NotFound("Property not found!");
        const table = await Table.findOne({ _id : req.body.table, property : req.body.property });
        if( table === null ) throw createHttpError.NotFound("Table not found!");

        const order = new Order({
            user : req.user.user_id,
            ...req.body
        });
        await order.save();

        res.status(201).json({
            data: order,
            message: `Order placed successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }   
}

const readOrder = async (req, res, next) => {
    try {
       if( req.params.orderId === undefined ) throw createHttpError.NotFound("Order not found!");
       const order = await Order.findById(req.params.orderId);
       res.status(200).json({
            data: order,
            message: `Order fetched successfully.`,
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
            message: `Orders fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

const getOrdersByPropertyID = async (req, res, next ) => {
    try {
        let orders;
        if( req.query.status === undefined ){
            orders = await Order.find({ property : req.params.propId });
        }else{
            orders = await Order.find({ property : req.params.propId,status : req.query.status });
        }
        res.status(200).json({
            data: orders,
            message: `Orders fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    try {
      
        const order = await Order.findById(req.params.orderId);
        if(order === null ) throw createHttpError.NotFound("Order not found!");
        const user = await Operator.findById(req.user.user_id,"work_on");

        if(user.work_on.toString() !== order.property.toString()) throw createHttpError.NotFound("Order not found!");
        if(!checkStateTransitions(order.status).includes(req.query.status)) 
            throw createHttpError.BadRequest(`Can't change state to ${req.query.status}.`)
        
        // change state
        const updated = await Order.findByIdAndUpdate(req.params.orderId,{ status : req.query.status }, { new : true });

        res.status(200).json({
            data: updated,
            message: `Order updated successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}


const checkStateTransitions = (state) => {
    switch (state) {
        case "Pending":
            return ['Cancelled','Preparing'];
        case "Cancelled":
            return ['Cancelled'];
        case "Preparing":
            return ['Delivering','Cancelled'];
        case "Delivering":
                return ['Delivered'];
        case "Delivered":
            return ['Delivered'];
        default:
            return [];
    }
}



module.exports = {
    createOrder,
    readOrder,
    getOrdersByUserId,
    getOrdersByPropertyID,
    updateOrder
}