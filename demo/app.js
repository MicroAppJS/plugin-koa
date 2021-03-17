'use strict';


module.exports = function(app) {

    // 增强 $config
    app.$dispatcher('config', require.resolve('@micro-app/test/config'));
    // 配置全局 helper
    app.$dispatcher('helper', require.resolve('@micro-app/test/helper'));
    // 配置全局 service
    app.$dispatcher('service', require.resolve('@micro-app/test/service'));
    // 配置全局 plugin
    app.$dispatcher('plugin', require.resolve('@micro-app/test/plugin'));
    // 配置全局  middleware
    app.$dispatcher('middleware', require.resolve('@micro-app/test/middleware'));
    // 配置路由 router
    app.$dispatcher('router', require.resolve('@micro-app/test/router'));

    return app;

};
