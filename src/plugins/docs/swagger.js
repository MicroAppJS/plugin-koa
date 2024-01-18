'use strict';

const swaggerJSDoc = require('swagger-jsdoc');
const { koaSwagger } = require('koa2-swagger-ui');
const { logger, path } = require('@micro-app/shared-utils');

function swaggerOptionsFactory(spec, config) {
    if (!spec) {
        const info = config.info || {};
        const root = info.root;
        if (!root) {
            logger.error('[swagger error]', 'root is null!!!');
            return;
        }
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
            apis: [
                path.resolve(root, 'src/**/*.[j|t]s'),
                path.resolve(__dirname, '**/*.[j|t]s'),
            ].concat(process.env.DOCS_SWAGGER_ROOT ? [
                path.resolve(process.env.DOCS_SWAGGER_ROOT, '**/*.[j|t]s'),
            ] : []),
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
    const swaggerOptions = swaggerOptionsFactory(null, config);
    if (!swaggerOptions) return;

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
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
