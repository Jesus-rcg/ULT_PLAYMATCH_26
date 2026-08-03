/**
 * ==========================================================
 *  EQUIPOS
  DESCRIPCIÓN:
 * Contiene la lógica de negocio del módulo Equipos.
 * Valida la información antes de enviarla al modelo.
 * ==========================================================
 */

import {
  obtenerEquiposModel,
  obtenerEquiposPorUsuarioModel,
  obtenerEquipoPorIdModel,
  existeNombreEquipoModel,
  crearEquipoModel,
  actualizarEquipoModel,
  desactivarEquipoModel,
} from "../models/equiposModel.js";

// ==========================================================
// Obtener todos los equipos
// ==========================================================
export const obtenerEquiposService = async () => {
  return await obtenerEquiposModel();
};

// ==========================================================
// Obtener equipos del usuario autenticado
// ==========================================================
export const obtenerEquiposPorUsuarioService = async (id_usuario) => {

  if (!id_usuario) {
    throw new Error("El usuario es obligatorio.");
  }

  return await obtenerEquiposPorUsuarioModel(id_usuario);
};

// ==========================================================
// Obtener equipo por ID
// ==========================================================
export const obtenerEquipoPorIdService = async (id_equipo) => {

  const equipo = await obtenerEquipoPorIdModel(id_equipo);

  if (!equipo) {
    throw new Error("El equipo no existe.");
  }

  return equipo;
};

// ==========================================================
// Registrar equipo
// ==========================================================
export const crearEquipoService = async (equipo) => {

  if (!equipo.nombre_equipo) {
    throw new Error("El nombre del equipo es obligatorio.");
  }

  if (!equipo.escudo) {
    throw new Error("Debe seleccionar un escudo.");
  }

  const existe = await existeNombreEquipoModel(
    equipo.nombre_equipo
  );

  if (existe) {
    throw new Error("Ya existe un equipo con ese nombre.");
  }

  const id = await crearEquipoModel(equipo);

  return {
    id,
    message: "Equipo registrado correctamente."
  };
};

// ==========================================================
// Actualizar equipo
// ==========================================================
export const actualizarEquipoService = async (
  id_equipo,
  equipo
) => {

  const existeEquipo = await obtenerEquipoPorIdModel(id_equipo);

  if (!existeEquipo) {
    throw new Error("El equipo no existe.");
  }

  if (!equipo.nombre_equipo) {
    throw new Error("El nombre del equipo es obligatorio.");
  }

  if (!equipo.escudo) {
    throw new Error("Debe seleccionar un escudo.");
  }

  await actualizarEquipoModel(id_equipo, equipo);

  return {
    message: "Equipo actualizado correctamente."
  };
};

// ==========================================================
// Desactivar equipo
// ==========================================================
export const desactivarEquipoService = async (id_equipo) => {

  const existeEquipo = await obtenerEquipoPorIdModel(id_equipo);

  if (!existeEquipo) {
    throw new Error("El equipo no existe.");
  }

  await desactivarEquipoModel(id_equipo);

  return {
    message: "Equipo desactivado correctamente."
  };
};