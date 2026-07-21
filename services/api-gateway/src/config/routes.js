const PUBLIC_AUTH_ROUTES = [
  { method: 'POST', path: '/api/auth/register' },
  { method: 'POST', path: '/api/auth/login' },
  { method: 'POST', path: '/api/auth/refresh' },
];

const isPublicAuthRoute = (req) => {
  return PUBLIC_AUTH_ROUTES.some(
    (route) => route.method === req.method && route.path === req.path
  );
};

module.exports = {
  PUBLIC_AUTH_ROUTES,
  isPublicAuthRoute,
};
