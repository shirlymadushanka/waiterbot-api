require('dotenv').config({path:__dirname + '/.env'})
const express = require('express');
const bp = require('body-parser');
const checkAuth = require('./api/middlewares/checkAuth');
const checkRole =  require('./api/middlewares/checkRole');
const { PORT } = require('./api/config');
const db = require('./db/index')
const app = express();


// middlewares
app.use(bp.json())

app.get('/api', (req,res,next) => {
    res.status(200).json({
        message : "Welcome to waiterbot-api",
        success : true
    })
});

// adding routes of the application
app.use('/api/auth',require('./api/routes/auth.routes'));
app.use('/api/admins',checkAuth,checkRole(["admin"]),require('./api/routes/admin.routes'));
// app.use('/api/owners',checkAuth,checkRole(["owner"]),require('./api/routes/owner.routes'));
// app.use('/api/clients',checkAuth,checkRole(["client"]),require('./api/routes/client.routes'));

// handling not found routes.
app.use((req,res,next)=>{
    const error = new Error("Not found!");
    error.status = 404;
    next(error);
});

// handling globle error.
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        message : err.message,
        success : false
    });
});

// connect to the database and listen on port
console.log("connecting to mongodb...");
db.dbconnect().then(() => {
    app.listen(PORT, () => {
        console.log(`server started at port ${PORT}`);
    })
}).catch(() => {
    console.log(`error connectiong to the database`);
})