require('dotenv').config({path:__dirname + '/.env'})
const express = require('express');
const bp = require('body-parser');
const checkAuth = require('./api/middlewares/checkAuth');
const checkRole =  require('./api/middlewares/checkRole')
const app = express();


// middlewares
app.use(bp.json())

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


module.exports = app;