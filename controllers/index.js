'use strict';

module.exports = (server) => {
    require('./users')(server);
    require('./movies')(server);
};