import { v4 as uuidv4 } from "uuid";

const getTarefaModel = (sequelize, { DataTypes }) => {
  const Tarefa = sequelize.define("tarefa", {
    objectId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Gera o UUID no backend como pedido
      primaryKey: true, // Vamos usar o UUID como chave principal
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false, // Descrição obrigatória
      validate: {
        notEmpty: true,
      },
    },
    concluida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Valor padrão false como pedido
    },
  });

  return Tarefa;
};

export default getTarefaModel;