'use strict';

const plugins = [
    'serve',
    'start',
];


module.exports = function(api) {

    return plugins.map(name => {
        return api.registerPlugin({
            id: `koa:plugin-${name}`,
            link: require.resolve(`./${name}`),
            // [Symbol.for('built-in')]: true,
        });
    });

};
