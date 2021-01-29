const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const UserBase = require('../models/UserBase');

var io = null;

module.exports = {

    connect: function (server) {
        console.log("starting socket.io server...");
        try {
            io = socketIO(server);
            io.use(async (socket, next) => {
                try {
                    const token = socket.handshake.auth.token;
                    const decodedPayload = jwt.verify(token, process.env.SECRET);
                    socket.user = decodedPayload;
                    next();
                } catch (error) {
                    next(new Error(error.message));
                }

            });
            io.sockets.on('connection', async (socket) => {
                console.log("new connection from - "+socket.user.user_id);
                let user = socket.user;
                const userDets = await UserBase.findById(user.user_id);

                if (user.role === "owner") {
                    console.log(user.user_id + " joining to property:" + userDets.properties[0].toString());
                    socket.join("property:" + userDets.properties[0].toString());
                } else if (user.role === "operator") {
                    console.log(user.user_id + " joining to property:" + userDets.work_on.toString());
                    socket.join("property:" + userDets.work_on.toString());
                }
                console.log(user.user_id + " joining to own:" + userDets._id.toString());
                socket.join(userDets._id.toString());

                socket.emit('connection_success', "successfully connected!");
                socket.emit('joined',socket.rooms);
                socket.on('disconnet', () => {
                    console.log("Client disconnected!");
                });
            });
        } catch (error) {
            console.log(error);
        }

    },

    emit: function (event, values) {
        if (io) {
            io.sockets.emit(event, values);
        } else {
            console.log("IO not defined!");
        }
    },

    emitToRoom: function (room, event, values) {
        if (io) {
            io.to(room.toString()).emit(event, values);
        } else {
            console.log("IO not defined!");
        }
    }
}
