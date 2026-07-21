const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config');

const createServiceProxy = ({ target, pathFilter, serviceName }) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathFilter,
    on: {
      proxyReq: (proxyReq, req) => {
        console.log("➡️ ProxyReq:", req.method, req.originalUrl, "->", target);
    
        if (req.user) {
          proxyReq.setHeader("X-User-Id", req.user.id);
          proxyReq.setHeader("X-User-Email", req.user.email);
        }
      },
    
      proxyRes: (proxyRes, req) => {
        console.log("⬅️ ProxyRes:", proxyRes.statusCode, req.originalUrl);
      },
    
      error: (err, req, res) => {
        console.error("❌ Proxy Error");
        console.error(err);
    
        if (!res.headersSent) {
          res.status(503).json({
            success: false,
            message: err.message,
          });
        }
      },
    },
  });
};

const authProxy = createServiceProxy({
  target: config.services.auth,
  pathFilter: '/api/auth/**',
  serviceName: 'Auth service',
});

const monitorProxy = createServiceProxy({
  target: config.services.monitor,
  pathFilter: (pathname) =>
    pathname.startsWith('/api/monitors') || pathname.startsWith('/api/dashboard'),
  serviceName: 'Monitor service',
});

module.exports = {
  authProxy,
  monitorProxy,
};
