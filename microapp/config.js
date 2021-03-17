'use strict';

const config = {
    server: {
        entry: '__tests__/app.js',
    },
};

config.plugins = [
    '@micro-app/plugin-deploy', // test
];

module.exports = config;
