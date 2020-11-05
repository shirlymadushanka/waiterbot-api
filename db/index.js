const mongoose = require("mongoose");
const { DB } = require('../api/config');

function dbconnect() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);
            mockgoose.prepareStorage()
                .then(() => {
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

function dbclose() {
    return mongoose.disconnect();
}

module.exports = {
    dbconnect,
    dbclose
}