'use strict';

module.exports = function koaPlugin(api, opts = {}) {
    return require('./plugins')(api);
};
