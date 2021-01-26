const createHttpError = require('http-errors');
const Property = require('../models/Property');
const Robot = require('../models/Robot');




const createRobot = async (req, res, next) => {
    try {
        const property = await Property.findById(req.body.property);
        if( property === null ) throw createHttpError.NotFound("Property not found!")
        const robot =  new Robot({
            ...req.body
        });
        await robot.save();
        res.status(201).json({
            data: robot,
            message: `Robot added successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }   
}

const readRobot = async (req, res, next) => {
    try {
        if(req.params.robId === undefined ) createHttpError.NotFound("Robot not found!");
        const robot = await Robot.findById(req.params.robId);
        res.status(200).json({
            data: robot,
            message: `Robot fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error)
    }
}


const getRobotsByPropertyId = async (req, res, next ) => {
    try {
        if(req.params.propId === undefined ) createHttpError.NotFound("Property not found!");
        const robots = await Robot.find({ property : req.params.propId });
        res.status(200).json({
            data: robots,
            message: `Robot fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

const updateRobot = async (req, res, next) => {
    try {
        if(req.params.robId === undefined ) createHttpError.NotFound("Robot not found!");
        const robot = await Robot.findByIdAndUpdate(req.params.robId,{ status : req.body.status },{ new : true });

        res.status(200).json({
            data: robot,
            message: `Robot updated successfully.`,
            success: true
        });

    } catch (error) {
        next(error);
    }
}

const removeRobot = async (req, res, next) => {
    try {
        if(req.params.robId === undefined ) createHttpError.NotFound("Robot not found!");
        await Robot.findByIdAndDelete(req.params.robId);
        res.status(200).json({
            data: {},
            message: `Robot removed successfully.`,
            success: true
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createRobot,
    readRobot,
    getRobotsByPropertyId,
    updateRobot,
    removeRobot
}