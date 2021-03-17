'use strict';

const KoaRouter = require('koa-router');

class Router extends KoaRouter {
    useRoute(path, ...middlewares) {
        const subrouter = middlewares.pop();
        if (subrouter instanceof KoaRouter) {
            this.use(path, ...middlewares, subrouter.routes(), subrouter.allowedMethods());
        } else {
            this.use(path, ...middlewares, subrouter);
        }
        return this;
    }
}

module.exports = Router;
