import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next();
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).send({ error: "Token invalido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await req.context.models.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).send({ error: "Usuario do token nao encontrado." });
    }

    req.context.me = user;
    return next();
  } catch (error) {
    return res.status(401).send({ error: "Token invalido ou expirado." });
  }
};

export default authMiddleware;