'use strict';

const swaggerJSDoc = require('swagger-jsdoc');
const koaSwagger = require('koa2-swagger-ui');
const { path } = require('@micro-app/shared-utils');

function swaggerOptionsFactory(spec, config) {
    if (!spec) {
        const info = config.info || {};
        return {
            swaggerDefinition: {
                info: {
                // API informations (required)
                    title: info.name, // Title (required)
                    version: info.version, // Version (required)
                    description: info.description, // Description (optional)
                },
            // host: `${config.host}:${config.port}`,
            // basePath: '/', // Base path (optional)
            },
            // Path to the API docs
            apis: [ path.resolve(__dirname, '../**/*.js') ],
        };
    }
    return {
        routePrefix: false,
        hideTopbar: true,
        swaggerOptions: { spec },
    };
}

module.exports = function(app) {

    const config = app.$config || {};
    const swaggerSpec = swaggerJSDoc(swaggerOptionsFactory(null, config));

    return {
        swaggerJson() {
            // Initialize swagger-jsdoc -> returns validated swagger spec in json format
            return function(ctx, next) {
                ctx.body = {
                    ...swaggerSpec,
                };
            };
        },

        // https://www.npmjs.com/package/koa2-swagger-ui
        swagger() {
            const opts = swaggerOptionsFactory(swaggerSpec);
            return function(ctx, next) {
                return koaSwagger(opts)(ctx, next);
            };
        },
    };
};
