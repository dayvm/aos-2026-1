import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const messages = await req.context.models.Message.findAll();
  return res.send(messages);
});

router.get("/:messageId", async (req, res) => {
  const message = await req.context.models.Message.findByPk(
    req.params.messageId,
  );

  if (!message) {
    return res.status(404).send({ error: "Mensagem nao encontrada." });
  }

  return res.send(message);
});

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send({ error: "Texto da mensagem e obrigatorio." });
  }

  const message = await req.context.models.Message.create({
    text,
    userId: req.context.me.id,
  });

  return res.status(201).send(message);
});

router.delete("/:messageId", async (req, res) => {
  const result = await req.context.models.Message.destroy({
    where: { id: req.params.messageId },
  });

  if (!result) {
    return res.status(404).send({ error: "Mensagem nao encontrada." });
  }

  return res.send(true);
});

export default router;