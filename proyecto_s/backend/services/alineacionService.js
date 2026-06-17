import {
  createAlineacion,
  guardarJugadores,
  getAlineacionesByEquipo,
  getAlineacionById,
  getJugadoresAlineacion,
  desactivarAlineaciones,
  activarAlineacionModel,
  eliminarJugadoresAlineacion,
  eliminarAlineacionModel,
} from "../models/alineacionModel.js";

export const guardarAlineacionService = async (data) => {
  const { id_equipo, nombre, activa, jugadores } = data;

  // Crear la alineación
  const result = await createAlineacion({
    id_equipo,
    nombre,
    activa,
  });

  const id_alineacion = result.insertId;

  // Preparar jugadores
  const lista = jugadores.map((j) => ({
    id_alineacion,
    id_jugador: j.id_jugador,
    posicion: j.posicion,
  }));

  // Guardarlos
  await guardarJugadores(lista);

  return id_alineacion;
};

// Obtener alineaciones de un equipo
export const obtenerAlineacionesService = async (id_equipo) => {
  return await getAlineacionesByEquipo(id_equipo);
};

// Obtener alineación completa
export const obtenerAlineacionService = async (id_alineacion) => {
  const alineacion = await getAlineacionById(id_alineacion);

  if (!alineacion) {
    throw new Error("La alineación no existe");
  }

  const jugadores = await getJugadoresAlineacion(id_alineacion);

  return {
    ...alineacion,
    jugadores,
  };
};

// Activar alineación
export const activarAlineacionService = async (id_equipo, id_alineacion) => {
  await desactivarAlineaciones(id_equipo);
  await activarAlineacionModel(id_alineacion);
};

// Eliminar alineación
export const eliminarAlineacionService = async (id_alineacion) => {
  await eliminarJugadoresAlineacion(id_alineacion);
  await eliminarAlineacionModel(id_alineacion);
};
