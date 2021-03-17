'use strict';

const path = require('path');
const { service } = require('@micro-app/cli');

service.registerPlugin({
    id: 'test:KoaPlugin',
    link: path.join(__dirname, '../src/index.js'),
});

(async () => {
    await service.run('serve');
    // console.log(result);
})();
