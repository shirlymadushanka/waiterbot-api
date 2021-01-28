const createHttpError = require('http-errors');
const Table = require('../models/Table');
const ObjectID = require('mongodb').ObjectID;




const createTable = async (req, res, next) => {
    try {
        const table = new Table({
            property: req.params.propId,
            ...req.body
        });
        await table.save();

        res.status(201).json({
            data: table,
            message: `Table created successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}



const getTablesByPropertyId = async (req, res, next) => {
    try {
        const tables = await Table.find({ property: req.params.propId });
        res.status(200).json({
            data: tables,
            message: `Table fetched successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}

const updateTable = async (req, res, next) => {
    try {
        if (req.params.tblId === undefined ) throw createHttpError.NotFound("Table not found!");
        const table = await Table.findOneAndUpdate(
            { _id: req.params.tblId, property: req.params.propId },
            { ...req.body },
            { new: true }
        );
        if (table === null) throw createHttpError.NotFound("Table not found!");

        res.status(200).json({
            data: table,
            message: `Table updated successfully.`,
            success: true
        });

    } catch (error) {
        next(error);
    }
}

const removeTable = async (req, res, next) => {
    try {
        const table = await Table.findOne(
            { _id: req.params.tblId, property: req.params.propId });
        if( table === null ) throw createHttpError.NotFound("Table not found!");

        await table.remove();

        res.status(200).json({
            data: {},
            message: `Table removed successfully.`,
            success: true
        });
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createTable,
    getTablesByPropertyId,
    updateTable,
    removeTable
}