const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { DB } = require('../api/config');

// genaral db connection function
function dbconnect() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'test') {
            mongoose.connect(DB, {
                useFindAndModify: false,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            }).then((res, err) => {
                if (err) return reject(err);
                resolve();
            })
        }
    });
}

// genaral db close function
function dbclose() {
    return mongoose.disconnect();
}

class MongoMemServer {

    constructor() {
        this.mongoServer = new MongoMemoryServer();
    }
    // start mongo memory server
    async start() {
        const URI = await this.mongoServer.getUri();
        mongoose.connect(URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
    }
    // stop mongo memory server
    async stop(){
        mongoose.disconnect();
        await this.mongoServer.stop();
    }
    // clean all collections
    async clean(){
        const collections = await mongoose.connection.db.collections;
        for (let collection of collections) {
            await collection.deleteMany();
        }
    }
}

module.exports = {
    dbconnect,
    dbclose,
    MongoMemServer
}