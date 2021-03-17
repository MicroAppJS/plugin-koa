'use strict';


const defaultConfig = {
    exclude: [ 'node_modules' ],
    compilerOptions: {
        baseUrl: './',
        paths: {
            // default
        },
    },
};

module.exports = function createJsConfig(api, { info } = {}) {

    const { fs, _ } = require('@micro-app/shared-utils');

    const mappings = JSON.parse(JSON.stringify(info.alias));
    const jsconfigPath = api.resolve('jsconfig.json');
    const jsConfig = Object.assign({}, defaultConfig);
    const orgPaths = jsConfig.compilerOptions.paths;

    jsConfig.compilerOptions.paths = {
        ...orgPaths,
        ...Object.keys(mappings).reduce((obj, key) => {
            let item = mappings[key];
            if (_.isPlainObject(item)) {
                item = item.link;
            }
            obj[`${key}/*`] = [].concat(item, item.endsWith('/') ? `${item}*` : `${item}/*`);
            return obj;
        }, {}),
    };

    fs.writeJSONSync(jsconfigPath, jsConfig, {
        encoding: 'utf8',
        spaces: 4,
    });

};
