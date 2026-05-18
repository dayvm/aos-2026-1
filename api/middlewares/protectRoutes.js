const protectRoutes = (req, res, next) => {
  const publicRoutes = [
    { method: "POST", path: "/session" },
    { method: "POST", path: "/session/refresh" },
    { method: "POST", path: "/users" },
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => route.method === req.method && route.path === req.path,
  );

  if (req.method === "GET") {
    if (req.path === "/session" && !req.context.me) {
      return res.status(401).send({ error: "Unauthorized." });
    }

    return next();
  }

  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    if (isPublicRoute) {
      return next();
    }

    if (!req.context.me) {
      return res.status(401).send({ error: "Unauthorized." });
    }
  }

  return next();
};

export default protectRoutes;