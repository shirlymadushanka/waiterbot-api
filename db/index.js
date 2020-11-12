const mongoose = require("mongoose");
const { DB,DB_TEST } = require('../api/config');

function dbconnect() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            mongoose.connect(DB_TEST, {
                useFindAndModify: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
                .then((res, err) => {
                    res.connection.dropDatabase();
                    console.log("Test database dropped successfully.");
                    if (err) return reject(err);
                    resolve();
                })
        } else {
            mongoose.connect(DB, {
                useFindAndModify: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
                .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
                })
        }
    });
}

function dbclose(){
    return mongoose.disconnect();
}

module.exports = {
    dbconnect,
    dbclose
}