'use strict';

let movieApi = require('./movies-api')
    , userApi = require('./users-api');

module.exports = {
    movies: movieApi,
    users: userApi
};