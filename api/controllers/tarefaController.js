import tarefaService from "../services/tarefaService";

const criarTarefa = async (req, res) => {
  const { descricao, concluida } = req.body;

  // Validação exigida: descrição obrigatória
  if (!descricao) {
    return res.status(400).send({ error: "A descrição é obrigatória." });
  }

  try {
    const tarefa = await tarefaService.criarTarefa({ descricao, concluida });
    return res.status(201).send(tarefa);
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
};

const listarTarefas = async (req, res) => {
  try {
    const tarefas = await tarefaService.listarTarefas();
    return res.status(200).send(tarefas);
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
};

const obterTarefaPorId = async (req, res) => {
  try {
    const tarefa = await tarefaService.obterTarefaPorId(req.params.objectId);
    
    // Tratamento de erro exigido: 404 se não achar
    if (!tarefa) {
      return res.status(404).send({ error: "Tarefa não encontrada." });
    }
    return res.status(200).send(tarefa);
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
};

const atualizarTarefa = async (req, res) => {
  try {
    const tarefaAtualizada = await tarefaService.atualizarTarefa(req.params.objectId, req.body);
    
    if (!tarefaAtualizada) {
      return res.status(404).send({ error: "Tarefa não encontrada." });
    }
    return res.status(200).send(tarefaAtualizada);
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
};

const deletarTarefa = async (req, res) => {
  try {
    const resultado = await tarefaService.deletarTarefa(req.params.objectId);
    
    if (!resultado) {
      return res.status(404).send({ error: "Tarefa não encontrada." });
    }
    // Retorno exigido: mensagem de sucesso ou objeto vazio
    return res.status(200).send({ message: "Tarefa removida com sucesso." });
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
};

export default {
  criarTarefa,
  listarTarefas,
  obterTarefaPorId,
  atualizarTarefa,
  deletarTarefa,
};