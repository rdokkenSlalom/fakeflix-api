'use strict';

let diskdb = require('diskdb')
    , config = require('../config')
    , User = require('../common/models').User
    , messages = require('../common/messages')
    , db = diskdb.connect(config.path, ['users']);

let updateCollection = (query, item) => {
    let options = {
        multi: false,
        upsert: false
    };

    return new Promise((resolve, reject) => {
        try {
            let result = db.users.update(query, item, options);
            resolve(result);
        }
        catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    findOne: (credentials) => {
        return new Promise((resolve, reject) => {
            try {
                let result = db.users.findOne({
                    userName: credentials.userName
                });

                if (result) {
                    if (credentials.skipSecret) {
                        resolve(result);
                    } else {
                        if (result.secret === credentials.secret) {
                            resolve(result);
                        } else {
                            reject({
                                message: messages.invalidCredentials
                            });
                        }
                    }
                } else {
                    reject({
                        message: messages.invalidCredentials
                    });
                }
            }
            catch (error) {
                reject(error);
            }
        });
    },

    findOneById: (id) => {
        return new Promise((resolve, reject) => {
            try {
                let result = db.users.findOne({
                    _id: id
                });
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    },

    register: (userInfo) => {
        return new Promise((resolve, reject) => {
            try {
                let result = db.users.findOne({
                    userName: userInfo.userName
                });

                if (result) {
                    reject(reject({
                        message: messages.accountExists
                    }));
                } else {
                    userInfo.profileImage = `https://api.adorable.io/avatars/64/${userInfo.userName}.png`;
                    resolve(db.users.save(new User(userInfo)));
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
