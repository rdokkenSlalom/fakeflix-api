'use strict';

var Movie = (function () {
    let _self = {};

    function Movie(data) {
        _self = data;

        return _self;
    }

    return Movie;
})();

var User = (function () {
    let _self = {};

    function User(data) {
        _self = data;

        return _self;
    }

    return User;
})();

module.exports = {
    Movie: Movie,
    User: User
}