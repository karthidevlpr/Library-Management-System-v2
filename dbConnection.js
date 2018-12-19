const mongoose = require('mongoose');

module.exports = function (app) {
    const url = 'mongodb://localhost:27017/LibraryV2';
    let options = {
        reconnectTries: Number.MAX_VALUE,
        autoReconnect: true,
        reconnectInterval: 1000,
        keepAlive: 1,
        connectTimeoutMS: 30000,
        retryWrites: false,
        useNewUrlParser: true
    };

    mongoose.connect(url, options);

    mongoose.connection.on('error', function (e) {
        console.log("db: mongodb error " + e);
    });

    mongoose.connection.on('connected', function (e) {
        console.log('db: mongodb is connected: ' + url);
    });

    mongoose.connection.on('disconnecting', function () {
        console.log('db: mongodb is disconnecting!!!');
    });

    mongoose.connection.on('disconnected', function () {
        console.log('db: mongodb is disconnected!!!');
    });

    mongoose.connection.on('reconnected', function () {
        console.log('db: mongodb is reconnected: ' + url);
    });


    mongoose.connection.on('close', function () {
        console.log('db: mongodb connection closed');
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0);
        });
    });
};