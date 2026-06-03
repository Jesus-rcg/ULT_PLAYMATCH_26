import {
  getCronologiasModel,
  getCronologiaByIdModel,
  getJugadoresByEncuentroModel,
  createCronologiaModel,
  updateCronologiaModel,
  deleteCronologiaModel,
} from "../MODELS/cronologiasModel.js";

// Obtener todas
export const getCronologiasService = async () => {
  return await getCronologiasModel();
};

// Obtener por ID
export const getCronologiaByIdService = async (id) => {
  return await getCronologiaByIdModel(id);
};

// Obtener jugadores por encuentro
export const getJugadoresByEncuentroService = async (id) => {
  return await getJugadoresByEncuentroModel(id);
};

// Crear
export const createCronologiaService = async (cronologia) => {
  return await createCronologiaModel(cronologia);
};

// Actualizar
export const updateCronologiaService = async (id, cronologia) => {
  return await updateCronologiaModel(id, cronologia);
};

// Eliminar
export const deleteCronologiaService = async (id) => {
  return await deleteCronologiaModel(id);
};
