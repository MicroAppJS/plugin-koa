'use strict';

const { logger, CONSTANTS } = require('@micro-app/shared-utils');
const koaLogger = require('koa-logger');
const moment = require('moment');

module.exports = function(app) {
    const config = app.$config || {};
    const NAME = config.name || config.info.name || CONSTANTS.NAME;

    // 日志等级
    const LOGGER_LEVEL = process.env.MICROAPP_LOGGER_LEVEL || 5;

    const customLogger = {
        debug(...args) {
            if (Number(LOGGER_LEVEL) <= 0) {
                return;
            }
            const time = getTime();
            logger.debug(`[${time}]`, ...args);
        },
        error(...args) {
            if (Number(LOGGER_LEVEL) <= 1) {
                return;
            }
            const time = getTime();
            logger.error(`[${time}]`, ...args);
        },
        warn(...args) {
            if (Number(LOGGER_LEVEL) <= 2) {
                return;
            }
            const time = getTime();
            logger.warn(`[${time}]`, ...args);
        },
        info(...args) {
            if (Number(LOGGER_LEVEL) <= 4) {
                return;
            }
            const time = getTime();
            logger.info(`[${time}]`, ...args);
        },
        success(...args) {
            if (Number(LOGGER_LEVEL) <= 4) {
                return;
            }
            const time = getTime();
            logger.success(`[${time}]`, ...args);
        },

        printf(name = '', ...args) {
            if (Number(LOGGER_LEVEL) <= 4) {
                return;
            }
            const time = getTime();
            const title = `[${time}] | ${name}`;
            const len = title.length;
            const size = 20;
            let prefixSize = size - NAME.length - 2;
            prefixSize = prefixSize <= 0 ? 4 : prefixSize;
            logger.logo(
                `${'='.repeat(prefixSize)} ${title} ${'='.repeat(size)} \n`,
                ...args,
                `\n ${'^'.repeat(size * 2 + len + 2)} \n`
            );
        },
    };

    // 注册
    app.logger = app.context.logger = customLogger;

    app.use('koaLogger', koaLogger({
        transporter(str, args) {
            return customLogger.debug(...args);
        },
    }));

};

function getTime() {
    return moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
}
