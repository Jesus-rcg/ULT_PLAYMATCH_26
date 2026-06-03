import * as InscripcionJugadorModel from "../models/inscripcionJugadoresModel.js";

// Obtener todas las inscripciones
export const getInscripcionesJugadores = async () => {
  return InscripcionJugadorModel.getAllInscripcionesJugadores();
};

//Obtener por equipo
export const getInscripcionesByEquipo = async (id_equipo) => {
  if (!id_equipo) {
    throw new Error("ID de equipo requerido");
  }

  return InscripcionJugadorModel.getByEquipo(id_equipo);
};

//Obtener por ID
export const getInscripcionJugadorById = async (id) => {
  if (!id) {
    throw new Error("ID requerido");
  }

  return InscripcionJugadorModel.getInscripcionJugadorById(id);
};

//Crear inscripcion
export const crearInscripcionJugador = async (
  id_equipo,
  id_jugador,
  estado,
) => {
  if (!id_equipo || !id_jugador) {
    throw new Error("Datos incompletos");
  }

  return InscripcionJugadorModel.createInscripcionJugador(
    id_equipo,
    id_jugador,
    estado ?? "Pendiente",
  );
};

//Cambiar estado jugador
export const cambiarEstadoJugador = async (id_inscripcion_j, estado) => {
  const estadosValidos = ["Pendiente", "Inscrito", "Cancelado"];

  if (!estadosValidos.includes(estado)) {
    throw new Error("Estado no válido");
  }

  const inscripcion =
    await InscripcionJugadorModel.getInscripcionJugadorById(id_inscripcion_j);

  if (!inscripcion) {
    throw new Error("Inscripción no encontrada");
  }

  const estadoFinal = inscripcion.activo == 1 ? estado : "Cancelado";

  return InscripcionJugadorModel.updateEstadoJugador(
    id_inscripcion_j,
    estadoFinal,
  );
};

//Eliminar
export const eliminarInscripcionJugador = async (id_inscripcion_j) => {
  if (!id_inscripcion_j) {
    throw new Error("ID requerido");
  }

  return InscripcionJugadorModel.deleteInscripcionJugador(id_inscripcion_j);
};
