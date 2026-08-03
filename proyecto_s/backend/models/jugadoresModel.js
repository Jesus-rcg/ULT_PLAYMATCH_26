/**
 * ==========================================================
  *JUGADORES 
 *
 * DESCRIPCIÓN:
 * Consultas directas a la base de datos para la tabla
 * `jugadores`. Columnas reales de la tabla:
 * id_jugador, id_usuario, id_equipo, tarjetas, goles,
 * numero_camiseta, activo.
 * ==========================================================
 */

import pool from "../config/db.js";

// =======================================
// OBTENER TODOS LOS JUGADORES (activos)
// Trae también nombre del usuario y del
// equipo, para mostrar info completa.
// =======================================
export const getJugadoresModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      j.id_jugador,
      j.id_usuario,
      u.nombre_usuario,
      u.apellido_usuario,
      j.id_equipo,
      e.nombre_equipo,
      j.numero_camiseta,
      j.tarjetas,
      j.goles,
      j.activo
    FROM jugadores j
    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario
    INNER JOIN equipos e
      ON j.id_equipo = e.id_equipo
    WHERE j.activo = 1
    ORDER BY j.id_jugador ASC
  `);

  return rows;
};

// =======================================
// OBTENER JUGADOR POR ID
// =======================================
export const getJugadorByIdModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      j.id_jugador,
      j.id_usuario,
      u.nombre_usuario,
      u.apellido_usuario,
      j.id_equipo,
      e.nombre_equipo,
      j.numero_camiseta,
      j.tarjetas,
      j.goles,
      j.activo
    FROM jugadores j
    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario
    INNER JOIN equipos e
      ON j.id_equipo = e.id_equipo
    WHERE j.id_jugador = ?
    `,
    [id]
  );

  return rows[0];
};

// =======================================
// OBTENER JUGADORES POR EQUIPO (activos)
// Para la pestaña "Jugadores" del detalle
// de un equipo 
// =======================================
export const getJugadoresPorEquipoModel = async (id_equipo) => {
  const [rows] = await pool.query(
    `
    SELECT
      j.id_jugador,
      j.id_usuario,
      u.nombre_usuario,
      u.apellido_usuario,
      j.id_equipo,
      j.numero_camiseta,
      j.tarjetas,
      j.goles,
      j.activo
    FROM jugadores j
    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario
    WHERE j.id_equipo = ?
      AND j.activo = 1
    ORDER BY j.numero_camiseta ASC
    `,
    [id_equipo]
  );

  return rows;
};

// =======================================
// VALIDAR: ¿el usuario ya tiene una ficha
// de jugador activa? 
// =======================================
export const existeJugadorPorUsuarioModel = async (id_usuario) => {
  const [rows] = await pool.query(
    `
    SELECT id_jugador
    FROM jugadores
    WHERE id_usuario = ?
      AND activo = 1
    `,
    [id_usuario]
  );

  return rows.length > 0;
};

// =======================================
// VALIDAR: ¿el número de camiseta ya está
// usado en ESE equipo? 
// El parámetro id_jugador_excluir sirve
// para cuando se está EDITANDO un jugador,
// así no se compara contra sí mismo.
// =======================================
export const existeCamisetaEnEquipoModel = async (
  id_equipo,
  numero_camiseta,
  id_jugador_excluir = null
) => {
  let query = `
    SELECT id_jugador
    FROM jugadores
    WHERE id_equipo = ?
      AND numero_camiseta = ?
      AND activo = 1
  `;

  const params = [id_equipo, numero_camiseta];

  // Si estamos editando, excluimos el propio jugador de la comparación
  if (id_jugador_excluir) {
    query += ` AND id_jugador != ?`;
    params.push(id_jugador_excluir);
  }

  const [rows] = await pool.query(query, params);

  return rows.length > 0;
};

// =======================================
// VALIDAR: ¿el equipo pertenece al usuario
// (DT) autenticado
// =======================================
export const validarEquipoDelUsuarioModel = async (id_equipo, id_usuario) => {
  const [rows] = await pool.query(
    `
    SELECT id_equipo
    FROM equipos
    WHERE id_equipo = ?
      AND id_usuario = ?
    `,
    [id_equipo, id_usuario]
  );

  return rows.length > 0;
};

// =======================================
// CREAR JUGADOR
// =======================================
export const createJugadorModel = async (jugador) => {
  const {
    id_usuario,
    id_equipo,
    numero_camiseta,
  } = jugador;

  const [result] = await pool.query(
    `
    INSERT INTO jugadores
    (id_usuario, id_equipo, numero_camiseta, tarjetas, goles, activo)
    VALUES (?, ?, ?, '', 0, 1)
    `,
    [id_usuario, id_equipo, numero_camiseta]
  );

  return result;
};

// =======================================
// ACTUALIZAR JUGADOR
// Solo se editan el equipo y el número de
// camiseta, según 
// =======================================
export const updateJugadorModel = async (id, jugador) => {
  const {
    id_equipo,
    numero_camiseta,
  } = jugador;

  const [result] = await pool.query(
    `
    UPDATE jugadores
    SET
      id_equipo = ?,
      numero_camiseta = ?
    WHERE id_jugador = ?
    `,
    [id_equipo, numero_camiseta, id]
  );

  return result;
};

// =======================================
// DESACTIVAR JUGADOR (borrado lógico)
//  nunca se elimina físicamente,
// para conservar el historial de goles
// y tarjetas en cronologías.
// =======================================
export const desactivarJugadorModel = async (id) => {
  const [result] = await pool.query(
    `
    UPDATE jugadores
    SET activo = 0
    WHERE id_jugador = ?
    `,
    [id]
  );

  return result;
};

// =======================================
// NUEVA FUNCIÓN
// VALIDAR: ¿el EQUIPO de este jugador tiene
// un encuentro en curso? 
//
// Como ya no hay inscripción individual de
// jugadores, su participación se deriva del
// equipo. Por eso revisamos la tabla
// `encuentros`, buscando si el id_equipo
// aparece como local O como visitante en
// algún encuentro con estado = 'Jugando'.
// =======================================
export const equipoTieneEncuentroEnCursoModel = async (id_equipo) => {
  const [rows] = await pool.query(
    `
    SELECT id_encuentro
    FROM encuentros
    WHERE (id_equipo_local = ? OR id_equipo_visitante = ?)
      AND estado = 'Jugando'
      AND activo = 1
    `,
    [id_equipo, id_equipo]
  );

  return rows.length > 0;
};