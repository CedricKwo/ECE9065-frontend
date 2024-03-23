const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://bookstore-backend-service:3000', // Set the address of the target service you want to proxy
      changeOrigin: true,
    })
  );
};
