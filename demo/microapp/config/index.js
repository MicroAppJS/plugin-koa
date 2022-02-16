'use strict';

module.exports = {
    name: 'test',
    description: '测试 koa',
    version: '0.0.1',
    type: '',
    alias: {
        config: './src/config',
        helper: './src/helper',
        service: './src/service',
        plugin: './src/plugin',
        middleware: './src/middleware',
        router: './src/router',
    },
    server: {
        entry: 'app.js',
        options: {
            abc: 123,
        },
        cc: 1,
        // http2: true,
    },
    devServer: {
        port: 6666,
    },
};
