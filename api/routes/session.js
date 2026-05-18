import bcrypt from "bcryptjs";
import { Router } from "express";

import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpirationDate,
} from "../utils/tokens";

const router = Router();

router.get("/", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.context.me.id, {
    attributes: {
      exclude: ["passwordHash", "refreshToken", "refreshTokenExpiresAt"],
    },
  });

  return res.send(user);
});

router.post("/", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res
      .status(400)
      .send({ error: "Login e senha sao obrigatorios." });
  }

  const user = await req.context.models.User.findByLogin(login);

  if (!user) {
    return res.status(401).send({ error: "Credenciais invalidas." });
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    return res.status(401).send({ error: "Credenciais invalidas." });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = getRefreshTokenExpirationDate();

  await user.update({
    refreshToken,
    refreshTokenExpiresAt,
  });

  return res.send({
    accessToken,
    refreshToken,
  });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send({ error: "Refresh token e obrigatorio." });
  }

  const user = await req.context.models.User.findOne({
    where: { refreshToken },
  });

  if (!user) {
    return res.status(401).send({ error: "Refresh token invalido." });
  }

  if (!user.refreshTokenExpiresAt || new Date(user.refreshTokenExpiresAt) < new Date()) {
    await user.update({
      refreshToken: null,
      refreshTokenExpiresAt: null,
    });

    return res.status(401).send({ error: "Refresh token expirado." });
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken();

  await user.update({
    refreshToken: newRefreshToken,
    refreshTokenExpiresAt: user.refreshTokenExpiresAt,
  });

  return res.send({
    accessToken,
    refreshToken: newRefreshToken,
  });
});

router.delete("/", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send({ error: "Refresh token e obrigatorio." });
  }

  const user = await req.context.models.User.findOne({
    where: { refreshToken },
  });

  if (!user) {
    return res.status(404).send({ error: "Refresh token nao encontrado." });
  }

  await user.update({
    refreshToken: null,
    refreshTokenExpiresAt: null,
  });

  return res.status(204).send();
});

export default router;