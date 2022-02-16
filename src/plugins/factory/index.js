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

    const { index, port, host, entries = [], https = false, http2 = false } = info;

    const protocol = https ? 'https' : 'http';

    let server;
    if (https) {
        server = createServer(app, { protocol, isOpenHttp2: http2 }, typeof https === 'object' && https);
    } else {
        server = createServer(app, { protocol, isOpenHttp2: http2 });
    }

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

    const ps = [ listen(server, { protocol, host: _host, port: _port }) ];
    return Promise.all(ps).then(ress => {
        const res = { ...ress[0] };
        return res; // 只返回第一个配置
    });
};

function createServer(app, { protocol, isOpenHttp2 }, options) {
    let server = null;
    if (protocol === 'https') {
        const https = require('https');
        if (options) {
            if (isOpenHttp2) {
                const http2 = require('http2');
                server = http2.createSecureServer(options, app.callback());
            } else {
                server = https.createServer(options, app.callback());
            }
        } else {
            if (isOpenHttp2) {
                throw new Error('https "options" argument must be of type object.');
            }
            server = https.createServer(app.callback());
        }
    } else if (protocol === 'http') {
        if (isOpenHttp2) {
            const http2 = require('http2');
            server = http2.createServer(app.callback());
        } else {
            const http = require('http');
            server = http.createServer(app.callback());
        }
    }

    if (!server) {
        throw new Error(`Not Support protocol: ${protocol}!`);
    }

    app.server = server;
    return server;
}

function listen(server, { protocol, host, port }) {
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

        if (server) {
            server.listen(port, errCb);
        } else {
            reject(new Error(`Not Support protocol: ${protocol}!`));
        }
    });
}
