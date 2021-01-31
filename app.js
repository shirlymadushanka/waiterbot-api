require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express');
const mongoose = require("mongoose");
const bp = require('body-parser');
const checkAuth = require('./api/middlewares/checkAuth');
const { PORT, DB } = require('./api/config');
const app = express();
const morgan = require('morgan');
const Cors = require('cors');

const http = require('http').Server(app);

const socketServer = require('./api/socketio/socketServer');

socketServer.connect(http);

// third party middlewares
app.use(bp.json());
// app.use(morgan('dev'));
app.use(Cors());

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

if(process.env.NODE_ENV !== "test"){
    // connect to mongodb and start listening on port
    mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then(() => {
            http.listen(PORT);
            console.log(`Server is started at port ${PORT}`);
        })
        .catch((err) => console.log(err));

}

module.exports = {
    http
};