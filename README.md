# Micro APP Plugin Koa

[Plugin] koa adapter plugin for micro-app.

Micro APP 依赖 Koa 插件.

[![Coverage Status][Coverage-img]][Coverage-url]
[![CircleCI][CircleCI-img]][CircleCI-url]
[![NPM Version][npm-img]][npm-url]
[![NPM Download][download-img]][download-url]

[Coverage-img]: https://coveralls.io/repos/github/MicroAppJS/MicroApp-plugin-koa/badge.svg?branch=master
[Coverage-url]: https://coveralls.io/github/MicroAppJS/MicroApp-plugin-koa?branch=master
[CircleCI-img]: https://circleci.com/gh/MicroAppJS/MicroApp-plugin-koa/tree/master.svg?style=svg
[CircleCI-url]: https://circleci.com/gh/MicroAppJS/MicroApp-plugin-koa/tree/master
[npm-img]: https://img.shields.io/npm/v/@micro-app/plugin-koa.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@micro-app/plugin-koa
[download-img]: https://img.shields.io/npm/dm/@micro-app/plugin-koa.svg?style=flat-square
[download-url]: https://npmjs.org/package/@micro-app/plugin-koa

## Install

```sh
yarn add @micro-app/plugin-koa
```

or

```sh
npm install -D @micro-app/plugin-koa
```

## Usage

### 在 microapp/config 中配置

```js
'use strict';

module.exports = {
    ...
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
    },
    devServer: {
        port: 6666,
    },
};
```

### 入口文件 `server.entry` 中

分发调用指定的模块，其中 `router` 为必须项

```js
'use strict';


module.exports = function(app) {

    // // 增强 $config
    // app.$dispatcher('config', require.resolve('@micro-app/test/config'));
    // // 配置全局 helper
    // app.$dispatcher('helper', require.resolve('@micro-app/test/helper'));
    // // 配置全局 service
    // app.$dispatcher('service', require.resolve('@micro-app/test/service'));
    // // 配置全局 plugin
    // app.$dispatcher('plugin', require.resolve('@micro-app/test/plugin'));
    // // 配置全局  middleware
    // app.$dispatcher('middleware', require.resolve('@micro-app/test/middleware'));
    // 配置路由 router
    app.$dispatcher('router', require.resolve('@micro-app/test/router'));

    return app;

};

```

### 开启 swagger

配置 `.env` 文件，开启 Swagger，只支持 `src/**/*.js` 目录下文件

```conf
DOCS_SWAGGER=true
```

通过扩展配置 `DOCS_SWAGGER_ROOT`，可支持其它目录 `path.resolve(process.env.DOCS_SWAGGER_ROOT, '**/*.js')` 目录下文件

```conf
DOCS_SWAGGER_ROOT={{ dirname }}
```

配置 swagger 文档，需要在接口方法中增加注释，如下：

```js
// https://www.npmjs.com/package/swagger-jsdoc
/**
 * @swagger
 * /api/docs/swagger.json:
 *   get:
 *     summary: 返回 swagger.json
 *     description: 返回 json 格式的 swagger.json
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/swagger.json', swaggerRoutes.swaggerJson());

/**
 * @swagger
 * /api/docs/swagger:
 *   get:
 *     summary: swagger 页面
 *     description: swagger 展示所有接口
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/swagger', swaggerRoutes.swagger());
```

> 可参考：https://editor.swagger.io/

访问接口文档

```js
/api/docs/swagger
// or
/api/docs/swagger.json
```