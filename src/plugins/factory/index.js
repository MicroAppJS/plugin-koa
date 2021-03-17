'use strict';


module.exports = async function(api, info = {}) {
    const Application = require('./Application.js');
    const app = new Application(api, info);

    const { index, port, host } = info;
    const runApp = require(index); // app.js
    runApp(app);

    const portfinder = require('portfinder');

    const _port = process.env.PORT || port || await portfinder.getPortPromise({
        port: 3000, // minimum port
        stopPort: 3333, // maximum port
    });

    const _host = process.env.HOST || host || '0.0.0.0';

    return new Promise((resolve, reject) => {
        app.listen(_port, _host, err => {
            if (err) {
                return reject(err);
            }
            resolve({ host: _host, port: _port, url: `http://${_host}:${_port}` });
        });
    });
};
