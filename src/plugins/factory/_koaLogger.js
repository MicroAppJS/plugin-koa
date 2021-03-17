'use strict';

const { logger, CONSTANTS } = require('@micro-app/shared-utils');
const koaLogger = require('koa-logger');
const moment = require('moment');

logger.level = process.env.DEBUG_LEVEL;

module.exports = function(app) {
    const config = app.$config || {};
    const NAME = config.name || config.info.name || CONSTANTS.NAME;

    const customLogger = {
        debug(...args) {
            const time = getTime();
            logger.debug(`[${time}]`, ...args);
        },
        error(...args) {
            const time = getTime();
            logger.error(`[${time}]`, ...args);
        },
        warn(...args) {
            const time = getTime();
            logger.warn(`[${time}]`, ...args);
        },
        info(...args) {
            const time = getTime();
            logger.info(`[${time}]`, ...args);
        },
        success(...args) {
            const time = getTime();
            logger.success(`[${time}]`, ...args);
        },

        printf(name = '', ...args) {
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
