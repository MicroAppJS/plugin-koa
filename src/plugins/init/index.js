'use strict';

module.exports = function initCommand(api, opts) {

    const { prompt } = require('@micro-app/shared-utils');

    // 自动添加 alias
    api.addCommandInit({
        namespace: '@',
        alias: {
            ...require('../data/aliases.json'),
        },
    });

    // entry
    api.addCommandInit((last, old) => {
        const pkg = api.pkg;
        const defaultMain = pkg.main || 'index.js';
        return function() {
            return prompt.input(`Enter Server Entry (${defaultMain}):`).then(answer => {
                const main = answer.trim();
                return {
                    server: {
                        entry: main || defaultMain,
                    },
                };
            });
        };
    });

    // host
    api.addCommandInit((last, old) => {
        const defaultHost = '0.0.0.0';
        return function() {
            return prompt.input(`Enter Server Host (${defaultHost}):`).then(answer => {
                const host = answer.trim();
                return {
                    server: {
                        host: host || defaultHost,
                    },
                };
            });
        };
    });

    // port
    api.addCommandInit((last, old) => {
        const defaultPort = 8080;
        return function() {
            return prompt.input(`Enter Server Port (${defaultPort}):`).then(answer => {
                const port = answer.trim();
                return {
                    server: {
                        port: port || defaultPort,
                    },
                };
            });
        };
    });

    // devServer host
    api.addCommandInit((last, old) => {
        const defaultHost = 'localhost';
        return function() {
            return prompt.input(`Enter DevServer Host (${defaultHost}):`).then(answer => {
                const host = answer.trim();
                return {
                    devServer: {
                        host: host || defaultHost,
                    },
                };
            });
        };
    });

    // devServer port
    api.addCommandInit((last, old) => {
        const defaultPort = 8081;
        return function() {
            return prompt.input(`Enter DevServer Port (${defaultPort}):`).then(answer => {
                const port = answer.trim();
                return {
                    devServer: {
                        port: port || defaultPort,
                    },
                };
            });
        };
    });

    // // 选择需要激活的插件
    // api.addCommandInit((last, old) => {
    //     const plugins = require('../data/plugins.json');
    //     return function() {
    //         const choices = Object.keys(plugins);
    //         if (choices.length === 0) {
    //             return Promise.resolve();
    //         }
    //         return prompt.check('Enable Plugins:', {
    //             choices: choices.map(key => {
    //                 return {
    //                     name: key,
    //                     checked: plugins[key],
    //                 };
    //             }),
    //         }).then(selected => {
    //             return {
    //                 server: {
    //                     plugins: selected.map(name => {
    //                         return {
    //                             name,
    //                             ...plugins[name],
    //                         };
    //                     }),
    //                 },
    //             };
    //         });
    //     };
    // });


    // api.addCommandInit({
    //     type: 'master',
    // });

    // api.beforeCommandInit(({ args }) => {
    //     console.warn(args);
    // });

    // api.otherCommandInit(async () => {
    //     await prompt.input('Enter Other1:').then(answer => {
    //         const host = answer.trim();
    //         console.log(host);
    //     });
    // });
    // api.otherCommandInit(async () => {
    //     await prompt.input('Enter Other2:').then(answer => {
    //         const host = answer.trim();
    //         console.log(host);
    //     });
    // });

    api.afterCommandInit(({ args, info }) => {
        if (!args.name) {
            // 同步修改 package.json 文件等
            require('./script/syncpkg.js')(api, { info });

            // create jsconfig.json
            require('./script/jsconfig.js')(api, { info });

            // npm instal
            require('./script/npminstall.js')(api, { info });

            api.logger.logo(`
                以后只需要修改 “microapp/config” 目录下的配置即可

                npm run dev
            `);
        }
    });
};


module.exports.configuration = {
    description: '增强模版初始化命令行',
};
