'use strict';
const { logger } = require('@micro-app/shared-utils');

module.exports = async function(api, info = {}) {
    const Application = require('./Application.js');
    const app = new Application(api, info);
    app.on('error', function(err, ctx) {
        // logger
        logger.error('[系统异常]', err);
    });

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            ctx.throw(error);
        }
    });

    const { index, port, host } = info;
    const runApp = require(index); // app.js
    await runApp(app);

    const portfinder = require('portfinder');

    const startPort = parseInt(process.env.PORT || port || 3000);
    const _port = await portfinder.getPortPromise({
        port: startPort, // minimum port
        stopPort: startPort + 300, // maximum port
    });

    const _host = process.env.HOST || host || '0.0.0.0';

    return new Promise((resolve, reject) => {
        app.listen(_port, _host, err => {
            if (err) {
                return reject(err);
            }
            resolve({ host: _host, port: _port, url: `http://${_host}:${_port}` });

            if (process.env.DOCS_SWAGGER) {
                logger.info('[Swagger UI]', `http://${_host}:${_port}/api/docs/swagger`);
            }
        });
    });
};
