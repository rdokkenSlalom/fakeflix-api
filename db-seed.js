'use strict';

let db = require('diskdb')
    , config = require('./config')
    , seedData = require('./seed.json')
    , Movie = require('./common/models').Movie
    , User = require('./common/models').User
    , messages = require('./common/messages')
    , methods = require('./common/methods')
    , fs = require('fs');

let connect = () => {
    return new Promise((resolve, reject) => {
        try {
            db.connect(config.path)
            db.loadCollections(['users', 'movies']);

            // Clear collections
            db.users.remove();
            db.movies.remove();

            resolve(db);
        }
        catch(error) {
            reject(error);
        }
    });

};

let toArrayBuffer= (buf) => {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }

    return ab;
}

module.exports = {
    seed: (server) => {
        connect().then((db) => {
            let movies = [];
            let users = [];

            for (var i = 0; i < seedData.movies.length; i++) {
                var movie = new Movie(seedData.movies[i]);
                movies.push(movie);

                // Load static file routes
                server.route({
                    method: methods.get,
                    path: movie.art,
                    handler: (request, reply) => {
                        reply.file('.' + movie.art);
                    }
                });
            }

            users.push(new User({
                userName: 'hpotter',
                secret: 'password',
                fullName: 'Harry Potter'
            }));

            console.log(messages.seeding);

            db.movies.save(movies);
            db.users.save(users);
        }, (error) => {
            console.log(error);
        });

        db.connect(config.path, ['users', 'movies']);


    }
}