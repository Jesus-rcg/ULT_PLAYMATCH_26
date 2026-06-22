import {
  getResultadosModel,
  getResultadoByIdModel,
  getResultadoByEncuentroModel,
  createResultadoModel,
  updateResultadoModel,
  deleteResultadoModel,
  sumarGolResultadoModel,
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

export const getResultadoByEncuentroService = async (idEncuentro) => {
  return await getResultadoByEncuentroModel(idEncuentro);
};

export const sumarGolResultadoService = async (idEncuentro, equipo) => {
  return await sumarGolResultadoModel(idEncuentro, equipo);
};
