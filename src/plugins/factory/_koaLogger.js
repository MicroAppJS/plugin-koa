'use strict';

const { logger, CONSTANTS } = require('@micro-app/shared-utils');
const koaLogger = require('koa-logger');
const moment = require('moment');

module.exports = function(app) {
    const config = app.$config || {};
    const NAME = config.name || config.info.name || CONSTANTS.NAME;

    // 日志等级
    const LEVEL_MAP = {
        debug: 1,
        error: 2,
        warn: 3,
        info: 4,
        success: 4,
        printf: 4,
    };
    let LOGGER_LEVEL = 5;
    if (process.env.MICROAPP_LOGGER_LEVEL && typeof process.env.MICROAPP_LOGGER_LEVEL === 'string') {
        LOGGER_LEVEL = LEVEL_MAP[process.env.MICROAPP_LOGGER_LEVEL.toLowerCase()];
        LOGGER_LEVEL = Number(LOGGER_LEVEL || process.env.MICROAPP_LOGGER_LEVEL);
    }

    const customLogger = {
        debug(...args) {
            if (LOGGER_LEVEL <= LEVEL_MAP.debug) {
                return;
            }
            const time = getTime();
            logger.debug(`[${time}]`, ...args);
        },
        error(...args) {
            if (LOGGER_LEVEL <= LEVEL_MAP.error) {
                return;
            }
            const time = getTime();
            logger.error(`[${time}]`, ...args);
        },
        warn(...args) {
            if (LOGGER_LEVEL <= LEVEL_MAP.warn) {
                return;
            }
            const time = getTime();
            logger.warn(`[${time}]`, ...args);
        },
        info(...args) {
            if (LOGGER_LEVEL <= LEVEL_MAP.info) {
                return;
            }
            const time = getTime();
            logger.info(`[${time}]`, ...args);
        },
        success(...args) {
            if (LOGGER_LEVEL <= LEVEL_MAP.success) {
                return;
            }
            const time = getTime();
            logger.success(`[${time}]`, ...args);
        },

        printf(name = '', ...args) {
            if (LOGGER_LEVEL <= LEVEL_MAP.printf) {
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
