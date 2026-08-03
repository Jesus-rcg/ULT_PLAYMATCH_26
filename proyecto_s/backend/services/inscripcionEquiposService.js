import {
  obtenerInscripcionesModel,
  obtenerInscripcionPorIdModel,
  obtenerInscripcionesPorTorneoModel,
  obtenerInscripcionesPorEquipoModel,
  validarEquipoUsuarioModel,
  validarTorneoAbiertoModel,
  validarInscripcionDuplicadaModel,
  validarOrganizadorTorneoModel,
  crearInscripcionModel,
  actualizarEstadoInscripcionModel,
  desactivarInscripcionModel,
} from "../models/inscripcionEquiposModel.js";

// =======================================
// OBTENER TODAS LAS INSCRIPCIONES
// =======================================
export const obtenerInscripcionesService = async () => {
  return await obtenerInscripcionesModel();
};

// =======================================
// OBTENER INSCRIPCIÓN POR ID
// =======================================
export const obtenerInscripcionPorIdService = async (id) => {
  return await obtenerInscripcionPorIdModel(id);
};

// =======================================
// OBTENER INSCRIPCIONES POR TORNEO
// =======================================
export const obtenerInscripcionesPorTorneoService = async (id_torneo) => {
  return await obtenerInscripcionesPorTorneoModel(id_torneo);
};

// =======================================
// OBTENER INSCRIPCIONES POR EQUIPO
// =======================================
export const obtenerInscripcionesPorEquipoService = async (id_equipo) => {
  return await obtenerInscripcionesPorEquipoModel(id_equipo);
};

// =======================================
// CREAR INSCRIPCIÓN
// =======================================
export const crearInscripcionService = async (
  id_usuario,
  data
) => {

  const {
    id_torneo,
    id_equipo,
  } = data;

  // Validar torneo abierto
  const torneoAbierto = await validarTorneoAbiertoModel(id_torneo);

  if (!torneoAbierto) {
    throw new Error("El torneo no admite nuevas inscripciones.");
  }

  // Validar que el equipo sea del DT
  const equipoPropio = await validarEquipoUsuarioModel(
    id_equipo,
    id_usuario
  );

  if (!equipoPropio) {
    throw new Error("No tiene permisos sobre este equipo.");
  }

  // Validar inscripción duplicada
  const duplicada = await validarInscripcionDuplicadaModel(
    id_torneo,
    id_equipo
  );

  if (duplicada) {
    throw new Error("El equipo ya está inscrito en este torneo.");
  }

  const id = await crearInscripcionModel({
    id_torneo,
    id_equipo,
  });

  return {
    id,
    message: "Solicitud de inscripción enviada."
  };
};

// =======================================
// ACTUALIZAR ESTADO
//  Solo el organizador del torneo
// puede aprobar o cancelar una inscripción.
// =======================================
export const actualizarEstadoInscripcionService = async (
  id,
  estado,
  id_usuario
) => {

  const estados = [
    "Pendiente",
    "Inscrito",
    "Cancelado",
  ];

  if (!estados.includes(estado)) {
    throw new Error("Estado inválido.");
  }

  // 1. Buscamos la inscripción para saber a qué torneo pertenece
  const inscripcion = await obtenerInscripcionPorIdModel(id);

  if (!inscripcion) {
    throw new Error("La inscripción no existe.");
  }

  // 2. Validamos que el usuario logueado sea el organizador
  //    del torneo al que pertenece esta inscripción
  const esOrganizador = await validarOrganizadorTorneoModel(
    inscripcion.id_torneo,
    id_usuario
  );

  if (!esOrganizador) {
    throw new Error(
      "No tiene permisos para gestionar esta inscripción."
    );
  }

  // 3. Solo si pasó la validación, se actualiza el estado
  await actualizarEstadoInscripcionModel(
    id,
    estado
  );

  return {
    message: "Inscripción actualizada correctamente."
  };
};

// =======================================
// ELIMINAR INSCRIPCIÓN
// =======================================
export const desactivarInscripcionService = async (id) => {

  const inscripcion = await obtenerInscripcionPorIdModel(id);

  if (!inscripcion) {
    throw new Error("La inscripción no existe.");
  }

  await desactivarInscripcionModel(id);

  return {
    message: "Inscripción eliminada correctamente."
  };

};