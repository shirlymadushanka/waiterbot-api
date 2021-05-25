const createHttpError = require("http-errors");
const Order = require("../models/Order");
const Robot = require("../models/Robot");
const Table = require("../models/Table");
const Property = require("../models/Property");
const Operator = require("../models/Operator");

const socketServer = require("../socketio/socketServer");

const createOrder = async (req, res, next) => {
  try {
    const property = await Property.findById(req.body.property);
    if (property === null)
      throw createHttpError.NotFound("Property not found!");
    const table = await Table.findOne(
      { _id: req.body.table, property: req.body.property },
      "_id table_number"
    );
    if (table === null) throw createHttpError.NotFound("Table not found!");

    const order = new Order({
      user: req.user !== undefined ? req.user.user_id : null,
      robot: null,
      ...req.body,
    });
    await order.save();

    // emit new user message
    socketServer.emitToRoom("property:" + property._id.toString(), "newOrder", {
      ...order._doc,
      table,
    });
    res.status(201).json({
      data: { ...order._doc, table },
      message: `Order placed successfully.`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const readOrder = async (req, res, next) => {
  try {
    if (req.params.orderId === undefined)
      throw createHttpError.NotFound("Order not found!");
    const order = await Order.findById(req.params.orderId).populate(
      "table",
      "_id table_number"
    );
    res.status(200).json({
      data: order,
      message: `Order fetched successfully.`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getOrdersByUserId = async (req, res, next) => {
  try {
    res.status(200).json({
      data: reviews,
      message: `Orders fetched successfully.`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getOrdersByPropertyID = async (req, res, next) => {
  try {
    let orders;
    if (req.query.status === undefined) {
      orders = await Order.find({ property: req.params.propId }).populate(
        "table",
        "_id table_number"
      );
    } else {
      orders = await Order.find({
        property: req.params.propId,
        status: req.query.status,
      }).populate("table", "_id table_number");
    }
    res.status(200).json({
      data: orders,
      message: `Orders fetched successfully.`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (order === null) throw createHttpError.NotFound("Order not found!");
    const user = await Operator.findById(req.user.user_id, "work_on");

    if (user.work_on.toString() !== order.property.toString())
      throw createHttpError.NotFound("Order not found!");
    if (!checkStateTransitions(order.status).includes(req.query.status))
      throw createHttpError.BadRequest(
        `Can't change state to ${req.query.status}.`
      );
    if(req.query.status === "Delivering") {
      const user = await Operator.findById(req.user.user_id,'work_on');
      const robot = await Robot.findOne({ _id : req.query.robotId, property : user.work_on });
      if(!robot) throw createHttpError.NotFound("Robot not found!");
    }
    // change state
    const updated = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.query.status, robot: req.query.status === "Delivering" ? req.query.robotId : null },
      { new: true }
    );
    const payloadToUser = {
      order_id: updated._id,
      property: updated.property,
      status: updated.status,
    };
    if (order.user !== null) {
      // emit changes to user
      socketServer.emitToRoom(
        order.user.toString(),
        "orderStateChange",
        payloadToUser
      );
      // emit changes to owner/operator
    }
    socketServer.emitToRoom(
      "property:" + order.property.toString(),
      "orderStateChange",
      payloadToUser
    );

    res.status(200).json({
      data: updated,
      message: `Order updated successfully.`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const checkStateTransitions = (state) => {
  switch (state) {
    case "Pending":
      return ["Cancelled", "Preparing"];
    case "Cancelled":
      return ["Cancelled"];
    case "Preparing":
      return ["Delivering", "Cancelled"];
    case "Delivering":
      return ["Delivered"];
    case "Delivered":
      return ["Delivered"];
    default:
      return [];
  }
};

module.exports = {
  createOrder,
  readOrder,
  getOrdersByUserId,
  getOrdersByPropertyID,
  updateOrder,
};
