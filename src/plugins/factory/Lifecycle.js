'use strict';

const { tryRequire, _, logger } = require('@micro-app/shared-utils');

module.exports = class Lifecycle {
    constructor(app) {
        this.app = app;

        this.__init__();
    }

    __init__() {
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
            if (ctx.respond === false) return; // 禁用响应
            if (ctx.status === config.STATUS_CODES.StatusNotFound) {
                if (!ctx.body) {
                    ctx.result(config.STATUS_CODES.StatusNotFound, 'Not Found API');
                }
            }
        });
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
