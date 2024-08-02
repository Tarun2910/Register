const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/tenants', {
      target: 'http://3.7.32.64:9090',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/auth', {
      target: 'http://3.7.32.64:9090',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/multitenant', {
      target: 'http://3.7.32.64:9090',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/user_service', {
      target: 'http://3.7.32.64:9090',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/dms_service', {
      target: 'http://3.7.32.64:9090',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/crm', {
      target: 'http://3.7.32.64:9090',
      changeOrigin: true,
    }),
  );
};
