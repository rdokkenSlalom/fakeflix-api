'use strict';

let Hapi = require('hapi')
    , inert = require('inert')
    , config = require('./config')
    , seed = require('./db-seed').seed
    , controllers = require('./controllers')
    , messages = require('./common/messages');

let server = new Hapi.Server();
server.connection({ port: config.port });

// Register plugins
server.register(inert, (error) => {
    if (error) {
        throw error;
    }
});

// Register controllers
controllers(server);

let start = () => {
    seed(server);
    server.start((error) => {
        if (error) {
            console.log(messages.error, error);
        } else {
            console.log(messages.listening, config.port);
        }
    });

};

start();