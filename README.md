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

```js
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

```