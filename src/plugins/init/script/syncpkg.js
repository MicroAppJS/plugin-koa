'use strict';

module.exports = function syncPkg(api, { info } = {}) {

    const { fs, loadFile } = require('@micro-app/shared-utils');

    const pkgPath = api.resolve('package.json');

    const pkg = loadFile(pkgPath);

    pkg.name = info.name;
    pkg.description = info.description;
    pkg.version = info.version;
    pkg.main = info.server && info.server.entry || pkg.main || 'index.js';

    fs.writeJSONSync(pkgPath, pkg, {
        encoding: 'utf8',
        spaces: 4,
    });

};
