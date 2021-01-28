const createHttpError = require('http-errors');
const Property = require('../models/Property');
const Robot = require('../models/Robot');
const Table = require('../models/Table');
const Operator = require('../models/Operator');
const ObjectID = require('mongodb').ObjectID;




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
        if(req.params.robId === undefined ) throw createHttpError.NotFound("Robot not found!");
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
        if(req.params.propId === undefined ) throw createHttpError.NotFound("Property not found!");
        const robots = await Robot.find({ property : req.params.propId }).populate('table',"table_number");
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
        if(req.params.robId === undefined ) throw createHttpError.NotFound("Robot not found!");
        if( req.body.status !== 'Idel' && req.body.table === undefined ) throw createHttpError.UnprocessableEntity("table property required!");
        
        const user = await Operator.findById(req.user.user_id,'work_on');
        const table = await Table.findById(req.body.table);
        
        if( table === null || user.work_on.toString() !== table.property.toString() ) throw createHttpError.NotFound("Table not found!");
        
        let tblID = req.body.status !== "Idle" ? req.body.table : null;
        console.log(tblID);

        const robot = await Robot.findOneAndUpdate(
            { _id : req.params.robId, property : user.work_on },
            { status : req.body.status,table : tblID },
            { new : true });
        if(robot === null ) throw createHttpError.NotFound("Robot not found!");
        
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