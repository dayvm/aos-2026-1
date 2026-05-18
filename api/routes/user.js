import bcrypt from "bcryptjs";
import { Router } from "express";

const router = Router();

const safeUserAttributes = {
  exclude: ["passwordHash", "refreshToken", "refreshTokenExpiresAt"],
};

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll({
    attributes: safeUserAttributes,
  });

  return res.send(users);
});

router.get("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId, {
    attributes: safeUserAttributes,
  });

  if (!user) {
    return res.status(404).send({ error: "Usuário não encontrado." });
  }

  return res.send(user);
});

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .send({ error: "Username, email e password são obrigatórios." });
  }

  const existingUsername = await req.context.models.User.findOne({
    where: { username },
  });

  if (existingUsername) {
    return res.status(409).send({ error: "Username já está em uso." });
  }

  const existingEmail = await req.context.models.User.findOne({
    where: { email },
  });

  if (existingEmail) {
    return res.status(409).send({ error: "Email já está em uso." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await req.context.models.User.create({
    username,
    email,
    passwordHash,
  });

  const userResponse = await req.context.models.User.findByPk(user.id, {
    attributes: safeUserAttributes,
  });

  return res.status(201).send(userResponse);
});

router.put("/:userId", (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});

router.delete("/:userId", (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

export default router;