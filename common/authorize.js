'use strict';

let Boom = require('boom')
    , Jwt = require('jwt-simple')
    , api = require('../api').users
    , config = require('../config')
    , messages = require('./messages');

let validateAuthorization = (request) => {
        let req = request.raw.req;
        let authorization = req.headers.authorization;

        return new Promise((resolve, reject) => {
            if (!authorization) {
                reject({
                    message: messages.unauthorized
                });
            } else {
                let decoded = Jwt.decode(authorization, config.jwt.secret);
                
                var credentials = decoded.user;
                credentials.skipSecret = true;
                
                api.findOne(credentials).then((user) => {
                    resolve(true);
                }, (error) => {
                    console.log(error);
                    reject(error);
                });
            }
        });
};

module.exports = (request) => {
    return new Promise((resolve, reject) => {
        validateAuthorization(request).then((valid) => {
            resolve(valid);
        }, (error) => {
            reject(error);
        });
    });
};