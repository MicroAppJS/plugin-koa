'use strict';

const { tryRequire, _, logger } = require('@micro-app/shared-utils');

module.exports = class Lifecycle {
    constructor(app) {
        this.app = app;
    }

    // config(root) {
    //     return this.__register__('config', root);
    // }

    // service(root) {
    //     return this.__register__('service', root);
    // }

    // helper(root) {
    //     return this.__register__('helper', root);
    // }

    // middleware(root) {
    //     return this.__register__('middleware', root);
    // }

    // plugin(root) {
    //     return this.__register__('plugin', root);
    // }

    router(root) {
        const app = this.app;
        const config = app.$config || {};

        // docs
        if (process.env.DOCS_SWAGGER) {
            logger.info('[DOCS_SWAGGER]', 'swagger is opened!');
            app.useRoute('/api/docs', require('../docs')(app));
        }
        // 404 Not Found
        app.use(async (ctx, next) => {
            await next();
            if (ctx.status === config.STATUS_CODES.StatusNotFound) {
                ctx.result(config.STATUS_CODES.StatusNotFound, 'Not Found API');
            } else if (!ctx.body) {
                ctx.result(config.STATUS_CODES.StatusNotFound, 'Not Found');
            }
        });
        return this.__register__('router', root);
    }

    __register__(name, root) {
        const app = this.app;
        const itemInstance = tryRequire(root);
        if (_.isFunction(itemInstance)) {
            return itemInstance(app);
        }
        logger.warn(`Not found ${name}:`, root);
        return false;
    }
};
