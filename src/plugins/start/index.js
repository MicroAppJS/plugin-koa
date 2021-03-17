'use strict';

module.exports = function(api, opts) {

    api.modifyCreateServer(() => {
        return async function({ args }) {
            const serverConfig = api.serverConfig;

            // console.info('serverConfig:', serverConfig);

            api.validateSchema(require('../configSchema'), serverConfig);

            const index = api.resolve(serverConfig.entry);

            const info = Object.assign({
                index,
            }, serverConfig);

            return require('../factory')(api, info);
        };
    });

};
