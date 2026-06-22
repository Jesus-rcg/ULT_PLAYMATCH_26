import {
  getEquiposModel,
  getEquipoByIdModel,
  getEquiposByTorneoModel,
  createEquipoModel,
  updateEquipoModel,
  deleteEquipoModel,
} from "../models/equiposModel.js";

// Obtener todos
export const getEquiposService = async () => {
  return await getEquiposModel();
};

// Obtener por ID
export const getEquipoByIdService = async (id) => {
  return await getEquipoByIdModel(id);
};

// Crear
export const createEquipoService = async (equipo) => {
  return await createEquipoModel(equipo);
};

// Actualizar
export const updateEquipoService = async (id, equipo) => {
  return await updateEquipoModel(id, equipo);
};

// Eliminar
export const deleteEquipoService = async (id) => {
  return await deleteEquipoModel(id);
};

// equipos por torneo
export const getEquiposByTorneoService = async (idTorneo) => {
  return await getEquiposByTorneoModel(idTorneo);
};
