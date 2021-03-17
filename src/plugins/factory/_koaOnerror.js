'use strict';

const http = require('http');
const { _ } = require('@micro-app/shared-utils');
const onerror = require('koa-onerror');

module.exports = function(app) {
    const config = app.$config || {};
    const isDev = config.isDev;
    const STATUS_CODES = config.STATUS_CODES;

    onerror(app, {
        json(err, ctx) {
            const message = (isDev || err.expose) && err.message
                ? err.message
                : http.STATUS_CODES[this.status];

            if (_.isFunction(ctx.result)) {
                ctx.result(STATUS_CODES.StatusInternalServerError, message);
            } else {
                ctx.body = { error: message };
            }
        },
    });
};
