/**
 * ==========================================================
 * SERVICIO: JUGADORES
 * 
 * Aquí se aplican las reglas de negocio antes de tocar
 * la base de datos:
 * Un usuario solo puede tener una ficha de jugador.
 * Número de camiseta único dentro del mismo equipo.
 * El DT solo administra jugadores de sus propios equipos.
 * Advertir si el equipo del jugador tiene
 * un encuentro en curso antes de desactivarlo.
 * ==========================================================
 */

import {
  getJugadoresModel,
  getJugadorByIdModel,
  getJugadoresPorEquipoModel,
  existeJugadorPorUsuarioModel,
  existeCamisetaEnEquipoModel,
  validarEquipoDelUsuarioModel,
  createJugadorModel,
  updateJugadorModel,
  desactivarJugadorModel,
  equipoTieneEncuentroEnCursoModel,
} from "../models/jugadoresModel.js";

// =======================================
// OBTENER TODOS LOS JUGADORES
// =======================================
export const getJugadoresService = async () => {
  return await getJugadoresModel();
};

// =======================================
// OBTENER JUGADOR POR ID
// =======================================
export const getJugadorByIdService = async (id) => {
  return await getJugadorByIdModel(id);
};

// =======================================
// OBTENER JUGADORES POR EQUIPO
// =======================================
export const getJugadoresPorEquipoService = async (id_equipo) => {
  return await getJugadoresPorEquipoModel(id_equipo);
};

// =======================================
// CREAR JUGADOR
// 
// =======================================
export const createJugadorService = async (jugador, id_usuario_dt) => {
  const { id_usuario, id_equipo, numero_camiseta } = jugador;

  // RN-005: el equipo debe pertenecer al DT autenticado
  const equipoPropio = await validarEquipoDelUsuarioModel(
    id_equipo,
    id_usuario_dt
  );

  if (!equipoPropio) {
    throw new Error("EQUIPO_AJENO");
  }

  // el usuario a registrar no debe tener ya una ficha de jugador
  const yaTieneJugador = await existeJugadorPorUsuarioModel(id_usuario);

  if (yaTieneJugador) {
    throw new Error("USUARIO_YA_TIENE_JUGADOR");
  }

  //  el número de camiseta no debe repetirse en ese equipo
  const camisetaOcupada = await existeCamisetaEnEquipoModel(
    id_equipo,
    numero_camiseta
  );

  if (camisetaOcupada) {
    throw new Error("CAMISETA_DUPLICADA");
  }

  return await createJugadorModel(jugador);
};

// =======================================
// ACTUALIZAR JUGADOR
// 
// =======================================
export const updateJugadorService = async (id, jugador, id_usuario_dt) => {
  const { id_equipo, numero_camiseta } = jugador;

  // Buscamos el jugador actual para saber a qué equipo pertenece hoy
  const jugadorActual = await getJugadorByIdModel(id);

  if (!jugadorActual) {
    throw new Error("JUGADOR_NO_EXISTE");
  }

  //  el equipo (nuevo o actual) debe pertenecer al DT autenticado
  const equipoPropio = await validarEquipoDelUsuarioModel(
    id_equipo,
    id_usuario_dt
  );

  if (!equipoPropio) {
    throw new Error("EQUIPO_AJENO");
  }

  //  el número de camiseta no debe repetirse en ese equipo
  // (excluyendo al propio jugador que se está editando)
  const camisetaOcupada = await existeCamisetaEnEquipoModel(
    id_equipo,
    numero_camiseta,
    id
  );

  if (camisetaOcupada) {
    throw new Error("CAMISETA_DUPLICADA");
  }

  return await updateJugadorModel(id, jugador);
};

// =======================================
// DESACTIVAR JUGADOR borrador lógico

// =======================================
export const desactivarJugadorService = async (
  id,
  id_usuario_dt,
  forzar = false
) => {
  const jugador = await getJugadorByIdModel(id);

  if (!jugador) {
    throw new Error("JUGADOR_NO_EXISTE");
  }

  // RN-005: el equipo del jugador debe pertenecer al DT autenticado
  const equipoPropio = await validarEquipoDelUsuarioModel(
    jugador.id_equipo,
    id_usuario_dt
  );

  if (!equipoPropio) {
    throw new Error("EQUIPO_AJENO");
  }

  // FA-01: si no se ha confirmado todavía, revisamos si hay
  // un encuentro en curso para advertir antes de desactivar
  if (!forzar) {
    const encuentroEnCurso = await equipoTieneEncuentroEnCursoModel(
      jugador.id_equipo
    );

    if (encuentroEnCurso) {
      throw new Error("ENCUENTRO_EN_CURSO");
    }
  }

  return await desactivarJugadorModel(id);
};