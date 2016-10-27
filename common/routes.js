'use strict';

module.exports = {
    logIn: '/user/login',
    register: '/user/register',
    rate: '/movies/ratings',
    subscription: '/movies/{movieId}/watchlist/{userId}',
    subscriptions: '/movies/watchlist/{userId}',
    movies: '/movies',
    movie: '/movies/{movieId}',
    search: '/movies/search/{term}' // NOT IMPLEMENTED
};