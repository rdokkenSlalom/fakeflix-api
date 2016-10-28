'use strict';

let Boom = require('boom')
    , fs = require('fs')
    , config = require('../config')
    , methods = require('../common/methods')
    , messages = require('../common/messages')
    , authorize = require('../common/authorize')
    , routes = require('../common/routes')
    , api = require('../api').movies;

let toBase64 = (file) => {
    let bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64')
};

module.exports = (server) => {
    //
    // Get all
    //
    server.route({
        method: methods.get,
        path: routes.movies,
        handler: (request, reply) => {
            authorize(request).then((valid) => {
                api.find().then((movies) => {
                    for (var i = 0; i < movies.length; i++) {
                        movies[i].art = 'data:image/png;base64,' + toBase64('.' + movies[i].art);
                    }

                    reply(movies);
                }, (error) => {
                    reject(Boom.notFound(error.message));
                });
            }, (error) => {
                reply(Boom.unauthorized(error.message));
            });
        }
    });

    //
    // Get single
    //
    server.route({
        method: methods.get,
        path: routes.movie,
        handler: (request, reply) => {
            authorize(request).then((valid) => {
                api.findOne({_id: request.params.movieId}).then((result) => {
                    result.art = 'data:image/png;base64,' + toBase64('.' + result.art);
                    reply(result);
                }, (error) => {
                    reject(Boom.notFound(error.message));
                });
            }, (error) => {
                reply(Boom.unauthorized(error.message));
            });
        }
    });

    // 
    // Movie rating
    // 
    server.route({
        method: methods.post,
        path: routes.rate,
        handler: (request, reply) => {
            authorize(request).then((valid) => {
                let query = {
                    _id: request.payload._id,
                    rating: request.payload.rating
                };

                api.updateRatings(query).then((results) => {
                    reply(results);
                }, (error) => {
                    reject(Boom.notFound(error.message));
                });
            }, (error) => {
                reply(Boom.unauthorized(error.message));
            });
        }
    });

    //
    // Subscriptions
    //
    server.route({
        method: methods.get,
        path: routes.subscriptions,
        handler: (request, reply) => {
            authorize(request).then((valid) => {
                let query = {
                    id: request.params.userId
                };

                api.findBySubscriberMovies(query).then((results) => {
                    for (var i = 0; i < results.length; i++) {
                        results[i].art = 'data:image/png;base64,' + toBase64('.' + results[i].art);
                    }

                    reply(results);
                }, (error) => {
                    reject(Boom.notFound(error.message));
                });
            }, (error) => {
                reply(Boom.unauthorized(error.message));
            });
        }
    });

    //
    // Subscribe
    //
    server.route({
        method: methods.put,
        path: routes.subscription,
        handler: (request, reply) => {
            authorize(request).then((valid) => {
                let query = {
                    movieId: request.params.movieId,
                    userId: request.params.userId
                };

                api.subscribeUser(query).then((results) => {
                    reply(results);
                }, (error) => {
                    reject(Boom.notFound(error.message));
                });
            }, (error) => {
                reply(Boom.unauthorized(error.message));
            });
        }
    });

    //
    // Unsubscribe
    //
    server.route({
        method: methods.delete,
        path: routes.subscription,
        handler: (request, reply) => {
            authorize(request).then((valid) => {
                let query = {
                    movieId: request.params.movieId,
                    userId: request.params.userId
                };

                api.unsubscribeUser(query).then((results) => {
                    reply(results);
                }, (error) => {
                    reject(Boom.notFound(error.message));
                });
            }, (error) => {
                reply(Boom.unauthorized(error.message));
            });
        }
    });
}

