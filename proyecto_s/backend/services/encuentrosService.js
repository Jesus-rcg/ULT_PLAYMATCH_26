import {
  getEncuentrosModel,
  getEncuentroByIdModel,
  createEncuentroModel,
  updateEncuentroModel,
  deleteEncuentroModel,
  generarEncuentrosAutomaticosModel,
  getEncuentrosByTorneoModel,
} from "../MODELS/encuentrosModel.js";

//Obtener todas
export const getEncuentrosService = async () => {
  return await getEncuentrosModel();
};

//Obtener por ID
export const getEncuentroByIdService = async (id) => {
  return await getEncuentroByIdModel(id);
};

export const getEncuentrosByTorneoService = async (id_torneo) => {
  return await getEncuentrosByTorneoModel(id_torneo);
};

//Crear encuentro
export const createEncuentroService = async (encuentro) => {
  return await createEncuentroModel(encuentro);
};

//Actualizar
export const updateEncuentroService = async (id, encuentro) => {
  return await updateEncuentroModel(id, encuentro);
};

//Eliminar
export const deleteEncuentroService = async (id) => {
  return await deleteEncuentroModel(id);
};

//Generar encuentro automaticamente
export const generarEncuentrosAutomaticosService = async (id_torneo) => {
  return await generarEncuentrosAutomaticosModel(id_torneo);
};
