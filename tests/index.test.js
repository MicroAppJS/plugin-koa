'use strict';

/* global expect */

describe('koa serve', () => {

    const path = require('path');
    const { service } = require('@micro-app/cli');

    service.registerPlugin({
        id: 'test:KoaPlugin',
        link: path.join(__dirname, '../src/index.js'),
    });

    it('serve', () => {
        // const result = await service.run('serve');
        console.info('OK');
    }, 1000);

});
