import {
  findUsuarioById,
  findUsuarioByEmail,
  getAllUsuarios,
  updateUsuarioModel,
  deleteUsuarioModel,
  registrarUsuarioModel,
} from "../models/usuarioModel.js";

//Obtener todas
export const getUsuariosService = async () => {
  return await getAllUsuarios();
};

//btern por ID
export const getUsuarioByIdService = async (id) => {
  const user = await findUsuarioById(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};

//Actualizar
export const updateUsuarioService = async (id, data) => {
  const user = await findUsuarioById(id);

  if (!user) {
    throw new Error("Usuario no existe");
  }

  await updateUsuarioModel(id, data);
};

//Eliminar
export const deleteUsuarioService = async (id) => {
  const user = await findUsuarioById(id);

  if (!user) {
    throw new Error("Usuario no existe");
  }

  await deleteUsuarioModel(id);
};

//Registrar usuario
export const registrarUsuarioService = async (data) => {
  const usuario = await findUsuarioByEmail(data.email);

  if (usuario) {
    throw new Error("El email ya está registrado");
  }
  await registrarUsuarioModel(data);
};