'use strict';

module.exports = function(api, opts) {

    // 开发模式
    api.modifyCreateDevServer(() => {

        const { smartMerge } = require('@micro-app/shared-utils');

        return async function({ args }) {
            const serverConfig = api.serverConfig;
            const devServerConfig = api.selfConfig && api.selfConfig.get('devServer') || {};

            const config = smartMerge({}, serverConfig, devServerConfig);
            api.validateSchema(require('../configSchema'), config);

            const index = api.resolve(config.entry);

            const info = Object.assign({
                index,
            }, config);

            return require('../factory')(api, info);
        };
    });

};
