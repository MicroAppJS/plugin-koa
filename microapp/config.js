'use strict';

const config = {
    server: {
        entry: 'tests/app.js',
    },
};

config.plugins = [
    '@micro-app/plugin-deploy', // test
];

module.exports = config;
