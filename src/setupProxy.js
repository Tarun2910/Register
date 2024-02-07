const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/tenants', {
      target: 'http://gateway-test.apps.ocp4.pacosta.com',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/auth', {
      target: 'http://gateway-test.apps.ocp4.pacosta.com',
      changeOrigin: true,
    }),
  );
};
