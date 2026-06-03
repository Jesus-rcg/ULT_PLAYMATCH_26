import {
  getEquiposModel,
  getEquipoByIdModel,
  createEquipoModel,
  updateEquipoModel,
  deleteEquipoModel,
} from "../models/equiposModel.js";

//Obtener todas
export const getEquiposService = async () => {
  return await getEquiposModel();
};

//Obtener por ID
export const getEquipoByIdService = async (id) => {
  return await getEquipoByIdModel(id);
};

//Crear equipo
export const createEquipoService = async (equipo) => {
  return await createEquipoModel(equipo);
};

//Actualizar
export const updateEquipoService = async (id, equipo) => {
  return await updateEquipoModel(id, equipo);
};

//Eliminar
export const deleteEquipoService = async (id) => {
  return await deleteEquipoModel(id);
};
