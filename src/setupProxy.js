const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://99.79.51.184:3000', // Set the address of the target service you want to proxy
      changeOrigin: true,
    })
  );
};
