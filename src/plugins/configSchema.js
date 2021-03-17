'use strict';

module.exports = {
    // additionalProperties: true,
    properties: {
        entry: {
            description: '后端服务入口路径. ( string )',
            type: 'string',
        },
        port: {
            description: '后端服务端口号. ( number )',
            type: 'number',
        },
        options: {
            description: '后端服务独立配置. ( object )',
            type: 'object',
        },
    },
    required: [
        'entry',
    ],
    type: 'object',
};
