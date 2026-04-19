import { Router } from "express";
import tarefaController from "../controllers/tarefaController";

const router = Router();

router.post("/", tarefaController.criarTarefa);
router.get("/", tarefaController.listarTarefas);
router.get("/:objectId", tarefaController.obterTarefaPorId);
router.put("/:objectId", tarefaController.atualizarTarefa);
router.delete("/:objectId", tarefaController.deletarTarefa);

export default router;