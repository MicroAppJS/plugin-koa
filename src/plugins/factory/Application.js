'use strict';

const Koa = require('koa');
const { _, logger, isDocker, assert } = require('@micro-app/shared-utils');

const Lifecycle = require('./Lifecycle.js');
const Router = require('./Router.js');

const CREATE_CONFIG = Symbol('CREATE_CONFIG');
const CREATE_API = Symbol('CREATE_API');
const CREATE_LIFECYCLE = Symbol('CREATE_LIFECYCLE');
const INIT_ROOT_ROUTER = Symbol('INIT_ROOT_ROUTER');

// 开放的一些内部 api
const WHITE_LIST = [
    'resolve',
];

module.exports = class Application extends Koa {

    constructor(api, info) {
        super();

        // 根路由
        this.rootRouter = this[INIT_ROOT_ROUTER]();
        this.$api = this[CREATE_API](api);
        this.$config = this[CREATE_CONFIG](info);
        this.$lifecycle = this[CREATE_LIFECYCLE]();

        // enhance context
        this.context.$config = this.$config;
        this.context.$api = this.$api;
        this.$helper = this.context.$helper = {};
        this.$service = this.context.$service = {};
        this.$plugin = this.context.$plugin = {};

        require('./_koaOnerror')(this);
        require('./_koaLogger')(this);
        require('./_customResult')(this);
    }

    [INIT_ROOT_ROUTER]() {
        const rootRouter = this.$newRouter();
        return rootRouter;
    }

    [CREATE_API](api) {
        return new Proxy({}, {
            get(target, p, r) {
                if (p === Symbol.for('nodejs.util.inspect.custom')) {
                    return function() {
                        return WHITE_LIST;
                    };
                }
                if (WHITE_LIST.includes(p)) {
                    return Reflect.get(api, p, r);
                }
                return;
            },
        });
    }

    [CREATE_CONFIG](info) {
        const isProd = process.env.NODE_ENV === 'production';
        const isDev = process.env.NODE_ENV === 'development';

        return Object.assign({}, {
            STATUS_CODES: require('../data/STATUS_CODES.json'),
            // 增强
            isRunningInDocker: isDocker(),
            isProd, isDev,

        }, info);
    }

    [CREATE_LIFECYCLE]() {
        const lifecycle = new Lifecycle(this);
        return lifecycle;
    }

    $dispatcher(name, ...args) {
        logger.info('[Lifecycle]', `dispatcher --> "${name}"`);
        const fn = this.$lifecycle[name];
        if (_.isFunction(fn)) {
            return fn.apply(this.$lifecycle, args);
        }
        return this.$lifecycle.__register__(name, ...args);
        // logger.error('[Lifecycle]', `Not Found --> "${name}"`);
        // return function() {};
    }

    /**
     * 创建一个 router 实例
     * @param  {...any} args args
     * @return {Router} new instance
     */
    $newRouter(...args) {
        return new Router(...args);
    }

    use(...args) {
        const firstArg = args[0];
        if (_.isString(firstArg)) {
            logger.info('[Middleware]', 'name:', firstArg);
            return super.use(...args.slice(1));
        }
        return super.use(...args);
    }

    useRoute(...args) {
        return this.rootRouter.useRoute(...args);
    }

    $registerConfig(name, config) {
        this.$config[name] = config;
        return this;
    }

    $registerHelper(name, helper) {
        this.$helper[name] = helper;
        return this;
    }

    $registerService(name, service) {
        this.$service[name] = service;
        return this;
    }

    $registerPlugin(name, plugin) {
        this.$plugin[name] = plugin;
        return this;
    }

    hasMiddleware(name) {
        const config = this.$config;
        const middlewares = config.middlewares || [];
        return middlewares.some(middle => middle.name === name);
    }

    hasPlugin(name) {
        const config = this.$config;
        const plugins = config.plugins || [];
        return plugins.some(plugin => plugin.name === name);
    }

    callback(...args) {
        return super.callback(...args);
    }

    listen(server, ...args) {
        assert(server, 'server must be required');
        const rootRouter = this.rootRouter;
        this.use(rootRouter.routes());
        this.use(rootRouter.allowedMethods());
        return server.listen(...args);
    }
};
