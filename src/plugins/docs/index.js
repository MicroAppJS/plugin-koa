'use strict';


module.exports = function(app) {
    const router = app.$newRouter();
    const swaggerRoutes = require('./swagger.js')(app);

    if (swaggerRoutes) {
        // https://www.npmjs.com/package/swagger-jsdoc
        /**
         * @swagger
         * /api/docs/swagger.json:
         *   get:
         *     summary: 返回 swagger.json
         *     description: 返回 json 格式的 swagger.json
         *     responses:
         *       200:
         *         description: 成功
         */
        router.get('/swagger.json', swaggerRoutes.swaggerJson());

        /**
         * @swagger
         * /api/docs/swagger:
         *   get:
         *     summary: swagger 页面
         *     description: swagger 展示所有接口
         *     responses:
         *       200:
         *         description: 成功
         */
        router.get('/swagger', swaggerRoutes.swagger());
    }

    return router;
};
