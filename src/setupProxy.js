const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL, // Set the address of the target service you want to proxy
      changeOrigin: true,
    })
  );
};
