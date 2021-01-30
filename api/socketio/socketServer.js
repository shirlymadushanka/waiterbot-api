const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const UserBase = require('../models/UserBase');

var io = null;

module.exports = {

    connect: function (server) {
        console.log("starting socket.io server...");
        try {
            io = socketIO(server, {
                cors: {
                    origin: '*',
                }
            });
            
            io.use(async (socket, next) => {
                try {
                    const token = socket.handshake.query.token;
                    const decodedPayload = jwt.verify(token, process.env.SECRET);
                    socket.user = decodedPayload;
                    next();
                } catch (error) {
                    next(error);
                }
            });
            io.sockets.on('connection', async (socket) => {
                console.log("new connection from - ",socket.user.user_id);
                const user = await UserBase.findById(socket.user.user_id);

                if (user.role === "owner" ){
                    socket.join("property:"+user.properties[0].toString());
                } else if(user.role === "operator"){
                    socket.join("property:"+user.work_on.toString());
                    console.log(user.work_on);
                }

                socket.join(socket.user.user_id,()=>{
                    io.to(socket.user.user_id).emit("join",{ joined : socket.rooms });
                });
                // socket.emit("success");
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
            console.log("[ EMITED ALL ]    " + event.toString());
        } else {
            console.log("IO not defined!");
        }
    },

    emitToRoom: function (room, event, values) {
        if (io) {
            io.to(room.toString()).emit(event, values);
            console.log("[ EMITED TO ROOM ]    " + room.toString());
        } else {
            console.log("IO not defined!");
        }
    }
}
