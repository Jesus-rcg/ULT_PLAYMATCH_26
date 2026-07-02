import {
  getTorneosModel,
  createTorneoModel,
  getTorneoByIdModel,
  deleteTorneoModel,
  updateTorneoModel,
  actualizarEstadoTorneoModel
} from "../models/torneoModel.js";

import { getTipoTorneoModel } from "../models/torneoModel.js";

import { getCategoriaModel } from "../models/torneoModel.js";


// =========================
// OBTENER TODOS
// =========================
export const getTorneosService = async () => {
  return await getTorneosModel();
};

// =========================
// OBTENER Tipo Torneo
// =========================
export const getTipoTorneoService = async () => {
  return await getTipoTorneoModel();
};
// =========================
// OBTENER Categoria
// =========================
export const getCategoriaService = async () => {
  return await getCategoriaModel();
};

// =========================
// OBTENER POR USUARIO
// =========================
export const getTorneosByUsuarioService = async (id_usuario) => {
  if (!id_usuario) {
    throw new Error("ID de usuario requerido");
  }

  return await getTorneosByUsuarioModel(id_usuario);
};

// =========================
// OBTENER POR ID
// =========================
export const getTorneoByIdService = async (id) => {
  return await getTorneoByIdModel(id);
};

// =========================
// CREAR TORNEO
// =========================
export const createTorneoService = async (data) => {
  const categorias = [
    "Amateur",
    "Profesional",
    "Semiprofesional",
    "Sub 20",
    "Sub 17",
    "Sub 15",
    "Pony",
  ];

  const tipos = ["Liga", "Grupos", "Eliminacion Directa"];

  if (!data.nombre_torneo || !data.ciudad) {
    throw new Error("Faltan campos obligatorios");
  }

  if (!categorias.includes(data.categoria)) {
    throw new Error("Categoría inválida");
  }

  if (!tipos.includes(data.tipo_torneo)) {
    throw new Error("Tipo de torneo inválido");
  }

  if (new Date(data.fecha_fin) < new Date(data.fecha_inicio)) {
    throw new Error(
      "La fecha de finalización no puede ser menor a la fecha de inicio",
    );
  }

  const id = await createTorneoModel(data);

  await actualizarEstadoTorneoModel(id);

  return { id };
};

// =========================
// ELIMINAR TORNEO
// =========================
export const deleteTorneoService = async (id) => {
  const torneo = await getTorneoByIdModel(id);

  if (!torneo) {
    throw new Error("Torneo no existe");
  }

  const hoy = new Date();

  if (new Date(torneo.fecha_inicio) <= hoy) {
    throw new Error("No se puede eliminar porque el torneo ya inició");
  }

  await desactivarTorneoModel(id);

  return {
    message: "Torneo eliminado correctamente",
  };
};

// =========================
// ACTUALIZAR TORNEO
// =========================
export const updateTorneoService = async (id, data) => {
  const torneo = await getTorneoByIdModel(id);

  if (!torneo) {
    throw new Error("Torneo no existe");
  }

  if (!data.nombre_torneo || !data.ciudad) {
    throw new Error("Faltan campos obligatorios");
  }

  const categorias = [
    "Amateur",
    "Profesional",
    "Semiprofesional",
    "Sub 20",
    "Sub 17",
    "Sub 15",
    "Pony",
  ];

  const tipos = ["Liga", "Grupos", "Eliminacion Directa"];

  if (!categorias.includes(data.categoria)) {
    throw new Error("Categoría inválida");
  }

  if (!tipos.includes(data.tipo_torneo)) {
    throw new Error("Tipo de torneo inválido");
  }

  if (new Date(data.fecha_fin) < new Date(data.fecha_inicio)) {
    throw new Error(
      "La fecha de finalización no puede ser menor a la fecha de inicio",
    );
  }

  await updateTorneoModel(id, data);

  await actualizarEstadoTorneoModel(id);

  return {
    message: "Torneo actualizado correctamente",
  };
};
