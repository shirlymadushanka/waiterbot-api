require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express');
const bp = require('body-parser');
const checkAuth = require('./api/middlewares/checkAuth');
const { PORT } = require('./api/config');
const db = require('./db/index')
const app = express();
const morgan = require('morgan');
const Cors = require('cors');

const http = require('http').Server(app);
const io = require('socket.io')(http);

const jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const UserBase = require('./api/models/UserBase');


// third party middlewares
app.use(bp.json())
app.use(morgan('dev'))
app.use(Cors())

app.get('/api', (req, res, next) => {
    res.status(200).json({
        message: "Welcome to waiterbot-api",
        success: true
    })
});

// adding routes of the application
app.use('/api/auth', require('./api/routes/auth.routes'));

app.use('/api/admins', checkAuth, require('./api/routes/admin.routes'));
app.use('/api/owners', checkAuth, require('./api/routes/owner.routes'));
app.use('/api/clients', checkAuth, require('./api/routes/client.routes'));
app.use('/api/operators', checkAuth, require('./api/routes/operator.routes'));

app.use('/api/properties', checkAuth, require('./api/routes/properties.routes'));
app.use('/api/items', checkAuth, require('./api/routes/item.routes'));
app.use('/api/robots', checkAuth, require('./api/routes/robot.routes'));
app.use('/api/foodreviews', checkAuth, require('./api/routes/itemReview.routes'));
app.use('/api/orders', checkAuth, require('./api/routes/order.routes'));

// handling not found routes.
app.use((req, res, next) => {
    const error = new Error("Not found!");
    error.status = 404;
    next(error);
});

// handling globle error.
app.use((err, req, res, next) => {
    let status = err.error ? 422 : 500;
    res.status(err.status || status);
    res.json({
        message: err.error ? err.error.message : err.message,
        success: false,
        data: {}
    });
});

// connect to the database and listen on port
db.dbconnect().then(() => {
    http.listen(PORT, () => {
        console.log(`server started at port ${PORT}`);
    })
}).catch(() => {
    console.log(`error connectiong to the database`);
});

// socket connections.
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
    
    let user = socket.user;
    const userDets = await UserBase.findById(user.user_id);
    
    if( user.role === "owner") {
        socket.join("property:"+userDets.properties[0].toString());
    }else if( user.role === "operator") {
        socket.join("property:"+userDets.work_on.toString());
    }
    socket.join(userDets._id.toString());

    socket.on('disconnet', () => {
        console.log("Client disconnected!");
    });
});




module.exports = {
    app : http,
    io
};