import {
  getResultadosModel,
  getResultadoByIdModel,
  createResultadoModel,
  updateResultadoModel,
  deleteResultadoModel,
} from "../MODELS/resultadosModel.js";

// Obtener todos
export const getResultadosService = async () => {
  return await getResultadosModel();
};

// Obtener por ID
export const getResultadoByIdService = async (id) => {
  return await getResultadoByIdModel(id);
};

// Crear
export const createResultadoService = async (resultado) => {
  return await createResultadoModel(resultado);
};

// Actualizar
export const updateResultadoService = async (id, resultado) => {
  return await updateResultadoModel(id, resultado);
};

// Eliminar
export const deleteResultadoService = async (id) => {
  return await deleteResultadoModel(id);
};
