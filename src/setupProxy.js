const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://bookstore-backend-service.default.svc.cluster.local:3000', // Set the address of the target service you want to proxy
      changeOrigin: true,
    })
  );
};
