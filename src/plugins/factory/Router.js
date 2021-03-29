'use strict';

const KoaRouter = require('koa-router');

class Router extends KoaRouter {
    useRoute(...middlewares) {
        const subrouter = middlewares.pop();
        if (subrouter instanceof KoaRouter) {
            this.use(...middlewares, subrouter.routes(), subrouter.allowedMethods());
        } else {
            this.use(...middlewares, subrouter);
        }
        return this;
    }
}

module.exports = Router;
