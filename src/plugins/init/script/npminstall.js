'use strict';

module.exports = function syncPkg(api, { info } = {}) {

    const { shell } = require('@micro-app/shared-utils');

    // 添加入 package.json 中 deps
    const plugins = info.server && info.server.plugins || [];
    const middlewares = info.server && info.server.middlewares || [];
    const dependencies = [].concat(plugins, middlewares).filter(item => {
        return item.install;
    }).reduce((arrs, item) => {
        if (item.dependencies && Array.isArray(item.dependencies)) {
            return arrs.concat(item.dependencies);
        }
        return arrs.concat(item.pkgName || item.name);
    }, []);

    if (dependencies.length) {
        const cmdStr = `npm install -S ${dependencies.join(' ')}`;
        api.logger.info('[Install]', cmdStr);
        shell.exec(cmdStr);
    } else {
        const cmdStr = 'npm install';
        api.logger.info('[Install]', cmdStr);
        shell.exec(cmdStr);
    }

};
