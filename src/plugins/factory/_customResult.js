'use strict';

const { _ } = require('@micro-app/shared-utils');

// 结果封装
module.exports = function(app) {
    const config = app.$config || {};
    const STATUS_CODES = config.STATUS_CODES;

    // status, result, message
    app.context.result = function() {
        const args = Array.prototype.slice.call(arguments);
        if (args.length < 3) {
            if (!_.isNumber(args[0])) {
                args.unshift(STATUS_CODES.StatusOK);
            }
        }
        const status = args[0];
        let result = args[1];
        let message = args[2];
        if (status !== STATUS_CODES.StatusOK) { // 特殊反转 result & message
            if (_.isString(args[1])) {
                message = args[1];
                result = args[2];
            } else if (args[1] instanceof Error) {
                message = args[1].message;
                result = args[2];
            }
        }

        const requestId = this.state.requestId;

        this.status = status;
        const json = {
            code: status,
            requestId,
            timestamp: Date.now(),
        };
        if (result) {
            json.result = result;
        }
        if (message) {
            json.message = message;
        } else {
            // TODO status 判断
        }

        if (status === STATUS_CODES.StatusNotFound) {
            json.method = this.method;
            json.path = this.path;
        }

        // api 前缀匹配后，会提取 version 字段
        if (this.path && this.path.startsWith('/api') && this.params) {
            const version = this.params.version;
            if (version) {
                json.version = version;
            }
        }

        this.set('x-response-id', requestId);

        const appId = this.state.appId;
        if (appId) {
            this.set('x-appid', appId);
        }

        this.logger.printf('Response Result', `${this.method} ${this.path}`, '\n',
            JSON.stringify(json, null, 4)
                .split('\n')
                .slice(0, 20)
                .join('\n')
        );
        this.body = json;
    };

    app.context.error = function(...args) {
        return this.result(STATUS_CODES.StatusBadRequest, ...args);
    };
};
