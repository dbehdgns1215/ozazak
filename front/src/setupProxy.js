const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // const target = process.env.REACT_APP_PROXY_TARGET || 'https://I14b205.p.ssafy.io';
  const target = process.env.REACT_APP_PROXY_TARGET || 'http://localhost:80';

  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // Log the request
        console.log(`[Proxy] ${req.method} ${req.url} -> ${target}${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers for all responses
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      }
    })
  );
};
