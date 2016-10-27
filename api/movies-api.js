'use strict';

let diskdb = require('diskdb')
    , config = require('../config')
    , db = diskdb.connect(config.path, ['movies']);

let API = {
    find: () => {
        return new Promise((resolve, reject) => {
            try {
                let results = db.movies.find();
                resolve(results);
            }
            catch (error) {
                reject(error);
            }
        });
    },

    findOne: (query) => {
        return new Promise((resolve, reject) => {
            try {
                let result = db.movies.findOne(query);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    },

    findBySubscriberMovies: (query) => {
        return new Promise((resolve, reject) => {
            try {
                API.find().then((results) => {
                    var subscriptions = [];
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].subscribers.indexOf(query.id) !== -1) {
                            subscriptions.push(results[i]);
                        }
                    }

                    resolve(subscriptions);
                }, (error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    },

    subscribeUser: (query) => {
        return new Promise((resolve, reject) => {
            try {
                API.findOne({ _id: query.movieId }).then((movie) => {
                    if (movie.subscribers.indexOf(query.userId) === -1) {
                        let subscribers = movie.subscribers;
                        subscribers.push(query.userId);

                        API.update(query.movieId, {
                            subscribers: subscribers
                        }).then((updateResult) => {
                            API.findOne({ _id: query.movieId }).then((subscribedMovie) => {
                                resolve(subscribedMovie)
                            }, (error) => {
                                reject(error);
                            });
                        }, (error) => {
                            reject(error);
                        });
                    }
                }, (error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    },

    unsubscribeUser: (query) => {
        return new Promise((resolve, reject) => {
            try {
                API.findOne({ _id: query.movieId }).then((movie) => {
                    if (movie.subscribers.indexOf(query.userId) !== -1) {
                        let index = movie.subscribers.indexOf(query.userId);
                        let subscribers = movie.subscribers;
                        movie.subscribers.splice(index, 1);

                        API.update(query.movieId, {
                            subscribers: subscribers
                        }).then((updateResult) => {
                            API.findOne({ _id: query.movieId }).then((subscribedMovie) => {
                                resolve(subscribedMovie)
                            }, (error) => {
                                reject(error);
                            });
                        }, (error) => {
                            reject(error);
                        });
                    }
                }, (error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    },

    updateRatings: (query) => {
        console.log(query);

        return new Promise((resolve, reject) => {
            API.findOne({ _id: query.id }).then((result) => {
                if (result) {
                    console.log('ORIGINAL', result);
                    let count = result.ratingCount + 1;
                    let rating = result.rating + query.rating;

                    API.update(query.id, {
                        ratingCount: count,
                        rating: rating
                    }).then((updateResult) => {
                        API.findOne({ _id: query.id }).then((updated) => {
                            updated.ratingAverage = Math.round(updated.rating / updated.ratingCount);
                            resolve(updated)
                        }, (error) => {
                            reject(error);
                        });
                    }, (error) => {
                        console.log(error);
                        reject(error);
                    });
                }
            }, (error) => {
                reject(error);
            });
        });
    },

    update: (id, props) => {
        let options = {
            multi: false,
            upsert: false
        };

        return new Promise((resolve, reject) => {
            try {
                let result = db.movies.update({ _id: id }, props, options);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    }
};

module.exports = API;