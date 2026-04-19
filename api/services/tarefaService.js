import models from "../models";

const criarTarefa = async (dados) => {
  return await models.Tarefa.create(dados);
};

const listarTarefas = async () => {
  return await models.Tarefa.findAll();
};

const obterTarefaPorId = async (objectId) => {
  return await models.Tarefa.findByPk(objectId);
};

const atualizarTarefa = async (objectId, dados) => {
  const tarefa = await models.Tarefa.findByPk(objectId);
  if (!tarefa) return null; // Retorna nulo se não achar, para o controller tratar o erro 404

  return await tarefa.update(dados);
};

const deletarTarefa = async (objectId) => {
  const tarefa = await models.Tarefa.findByPk(objectId);
  if (!tarefa) return null;

  await tarefa.destroy();
  return true;
};

export default {
  criarTarefa,
  listarTarefas,
  obterTarefaPorId,
  atualizarTarefa,
  deletarTarefa,
};