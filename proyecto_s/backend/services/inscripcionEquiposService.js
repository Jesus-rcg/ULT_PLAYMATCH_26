import * as InscripcionModel from "../models/inscripcionEquiposModel.js";

// Obtener todas
export const getInscripciones = async () => {
  return await InscripcionModel.getAllInscripciones();
};

// Obtener por torneo
export const getInscripcionesByTorneo = async (id_torneo) => {
  return await InscripcionModel.getByTorneo(id_torneo);
};

// Obtener por ID
export const getInscripcionById = async (id) => {
  return await InscripcionModel.getInscripcionById(id);
};

// Crear inscripción
export const crearInscripcion = async (id_torneo, id_equipo, estado) => {
  if (!id_torneo || !id_equipo) {
    throw new Error("Datos incompletos");
  }

  return await InscripcionModel.createInscripcion(
    id_torneo,
    id_equipo,
    estado || "Pendiente",
  );
};

// Cambiar estado
export const cambiarEstado = async (id_inscripcion_e, estado, activo) => {
  const estadosValidos = ["Pendiente", "Inscrito", "Cancelado"];

  if (!estadosValidos.includes(estado)) {
    throw new Error("Estado no válido");
  }

  const inscripcion =
    await InscripcionModel.getInscripcionById(id_inscripcion_e);

  if (!inscripcion) {
    throw new Error("Inscripción no encontrada");
  }

  return await InscripcionModel.updateEstado(id_inscripcion_e, estado, activo);
};

// Eliminar
export const eliminarInscripcion = async (id_inscripcion_e) => {
  return await InscripcionModel.deleteInscripcion(id_inscripcion_e);
};
