'use strict';

let Boom = require('boom')
    , Jwt = require('jwt-simple')
    , config = require('../config')
    , methods = require('../common/methods')
    , messages = require('../common/messages')
    , routes = require('../common/routes')
    , api = require('../api');

// Login validation
let validateLogin = (payload) => {
    return new Promise((resolve, reject) => {
        if (!payload || !payload.userName || !payload.secret) {
            return reject({
                message: messages.invalidCredentials
            });
        }

        api.users.findOne(payload).then((user) => {
            delete user.secret;
            resolve(user);
        }, (error) => {
            if (error) {
                reject({
                    message: messages.invalidCredentials
                });
            }
        });
    });
};

// Registration validation
let validateRegistration = (payload) => {
    return new Promise((resolve, reject) => {
        if (payload.fullName && payload.userName && payload.secret) {
            resolve(payload);
        } else {
            reject({
                message: messages.invalidRegistration,
                data: payload
            });
        }
    });
};

module.exports = (server) => {
    // 
    // Account login
    // 
    server.route({
        method: methods.post,
        path: routes.logIn,
        handler: (request, reply) => {
            validateLogin(request.payload).then((user) => {
                delete user.secret;

                let token = Jwt.encode({
                    user: user
                }, config.jwt.secret);

                reply({
                    id: user._id,
                    userName: user.userName,
                    fullName: user.fullName,
                    token: token
                });
            }, (error) => {
                reply(Boom.unauthorized(error.message));
            });
        }
    });

    //
    // Account registration
    //
    server.route({
        method: methods.post,
        path: routes.register,
        handler: (request, reply) => {
            validateRegistration(request.payload).then((userInfo) => {
                api.users.register(userInfo).then((result) => {
                    delete result.secret;

                    reply(result);
                }, (error) => {
                    reply(reply(Boom.notAcceptable(error.message, userInfo)));
                });
            }, (error) => {
                reply(Boom.notAcceptable(error.message, error.data));
            });
        }
    });
}

