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

    // 上下文参数
    const apiContext = api.context || {};

    const { index, port, host, entries = [], https = false } = info;
    if (entries.length > 0) {
        await entries.reduce((chain, entry) => {
            const runApp = require(entry); // app.js
            return chain.then(() => {
                return Promise.resolve(runApp(app));
            });
        }, Promise.resolve());
    } else { // 兼容
        const runApp = require(index); // app.js
        await runApp(app);
    }

    const portfinder = require('portfinder');

    const startPort = parseInt(process.env.PORT || apiContext.port || port || 3000);
    const _port = await portfinder.getPortPromise({
        port: startPort, // minimum port
        stopPort: startPort + 300, // maximum port
    });

    const _host = process.env.HOST || apiContext.host || host || '0.0.0.0';

    // const supportProtocols = ['http', 'https'];
    // app.listen(_port, _host, err => {
    //     if (err) {
    //         return reject(err);
    //     }
    //     resolve({ host: _host, port: _port, url: `http://${_host}:${_port}` });

    //     if (process.env.DOCS_SWAGGER) {
    //         logger.info('[Swagger UI]', `http://${_host}:${_port}/api/docs/swagger`);
    //     }
    // });

    const ps = [ createServer(app, { protocol: 'http', host: _host, port: _port }) ];
    if (https) {
        ps.push(createServer(app, { protocol: 'https', host: _host, port: +_port + 1 }, typeof https === 'object' && https));
    }
    return Promise.all(ps).then(ress => {
        const res = { ...ress[0] };
        res.https = ress[1];
        return ress[0]; // 只返回 http 配置
    });
};

function createServer(app, { protocol, host, port }, options) {
    return new Promise((resolve, reject) => {
        const errCb = err => {
            if (err) {
                return reject(err);
            }
            resolve({ host, port, url: `${protocol}://${host}:${port}` });

            if (process.env.DOCS_SWAGGER) {
                logger.info('[Swagger UI]', `${protocol}://${host}:${port}/api/docs/swagger`);
            }
        };
        if (protocol === 'https') {
            const https = require('https');
            let client = null;
            if (options) {
                client = https.createServer(options, app.callback());
            } else {
                client = https.createServer(app.callback());
            }
            client.listen(port, errCb);
        } else if (protocol === 'http') {
            const http = require('http');
            http.createServer(app.callback()).listen(port, errCb);
        } else {
            reject(new Error(`Not Support protocol: ${protocol}!`));
        }
    });
}
