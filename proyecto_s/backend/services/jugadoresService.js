import {
  getJugadoresModel,
  getJugadorByIdModel,
  createJugadorModel,
  updateJugadorModel,
  deleteJugadorModel
  
} from "../models/jugadoresModel.js";

//Obtener todas
export const getJugadoresService = async () => {
  return await getJugadoresModel();
};

//Obtener por ID
export const getJugadorByIdService = async (id) => {
  return await getJugadorByIdModel(id);
};


// Crear jugador
export const createJugadorService = async (jugador) => {

  const existe = await existeJugadorPorUsuarioModel(jugador.id_usuario);

  if (existe) {
    throw new Error("USUARIO_YA_TIENE_JUGADOR");
  }

  return await createJugadorModel(jugador);
};


//Actualizar
export const updateJugadorService = async (id, jugador) => {
  return await updateJugadorModel(id, jugador);
};

//Eliminar
export const deleteJugadorService = async (id) => {
  return await deleteJugadorModel(id);
};
