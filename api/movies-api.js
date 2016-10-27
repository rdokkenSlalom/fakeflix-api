'use strict';

let diskdb = require('diskdb')
    , config = require('../config')
    , db = diskdb.connect(config.path, ['movies']);

let updateMovieListRatings = (list) => {
    var updated = [];
    if (list.length > 0) {
    for (var i = 0; i < list.length; i++) {
            if (list[i].ratingCount === 0) {
                list[i].ratingAverage = 0;
            } else {
                list[i].ratingAverage = Math.round(list[i].rating / list[i].ratingCount);
            }
            
            updated.push(list[i]);
        }
    }

    return updated;
};

let API = {
    find: () => {
        return new Promise((resolve, reject) => {
            try {
                let results = db.movies.find();
                
                resolve(updateMovieListRatings(results));
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
                result.ratingAverage = Math.round(result.rating / result.ratingCount);

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

                    resolve(updateMovieListRatings(subscriptions));
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
                                subscribedMovie.ratingAverage = Math.round(subscribedMovie.rating / subscribedMovie.ratingCount);
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
                            API.findOne({ _id: query.movieId }).then((unsubscribedMovie) => {
                                unsubscribedMovie.ratingAverage = Math.round(unsubscribedMovie.rating / unsubscribedMovie.ratingCount);
                                resolve(unsubscribedMovie)
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
        return new Promise((resolve, reject) => {
            API.findOne({ _id: query._id }).then((result) => {
                if (result) {
                    let count = result.ratingCount + 1;
                    let rating = result.rating + query.rating;

                    API.update(query._id, {
                        ratingCount: count,
                        rating: rating
                    }).then((updateResult) => {
                        API.findOne({ _id: query._id }).then((updated) => {
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