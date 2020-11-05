const http = require('http');
const app = require('./app');
const { connect } = require("mongoose");
// get the port
const { PORT,DB } = require('./api/config');

// initialize the server.
const server = http.createServer(app);


const startApp = async () => {
    try {
        // try to connect to the database
        console.log(`[+]    connecting to database..`);
        await connect(DB, {
            useFindAndModify : true,
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useCreateIndex: true,
        });
        console.log(`[+]    successfully connected to the database.`);
        // listen on port
        server.listen(PORT || 3000 , ()=> console.log(`[+]    server is started on port ${PORT || 3000}.`));
        
    } catch (err) {
        console.log(`[-]    unable to connect with the database \n ${err}`);
        // try to connect again.
        startApp();
    }
}

// start the app
startApp();