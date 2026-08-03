/**
 * ==========================================================
 * Contiene todas las consultas SQL relacionadas con la
 * gestión de equipos.
 * ==========================================================
 */

import pool from "../config/db.js";

/**
 * ==========================================================
 * Obtener todos los equipos activos
 * ==========================================================
 */
export const obtenerEquiposModel = async () => {
  const [rows] = await pool.query(`
    SELECT
      e.id_equipo,
      e.nombre_equipo,
      e.escudo,
      e.activo,
      u.id_usuario,
      u.nombre_usuario,
      u.apellido_usuario
    FROM equipos e
    INNER JOIN usuarios u
      ON e.id_usuario = u.id_usuario
    WHERE e.activo = 1
    ORDER BY e.nombre_equipo ASC
  `);

  return rows;
};

/**
 * ==========================================================
 * Obtener los equipos del usuario autenticado
 * ==========================================================
 */
export const obtenerEquiposPorUsuarioModel = async (id_usuario) => {
  const [rows] = await pool.query(
    `
    SELECT
      id_equipo,
      id_usuario,
      nombre_equipo,
      escudo,
      activo
    FROM equipos
    WHERE id_usuario = ?
      AND activo = 1
    ORDER BY nombre_equipo ASC
    `,
    [id_usuario]
  );

  return rows;
};

/**
 * ==========================================================
 * Obtener un equipo por ID
 * ==========================================================
 */
export const obtenerEquipoPorIdModel = async (id_equipo) => {
  const [rows] = await pool.query(
    `
    SELECT
      id_equipo,
      id_usuario,
      nombre_equipo,
      escudo,
      activo
    FROM equipos
    WHERE id_equipo = ?
    `,
    [id_equipo]
  );

  return rows[0];
};

/**
 * ==========================================================
 * Verificar si ya existe un nombre de equipo
 * ==========================================================
 */
export const existeNombreEquipoModel = async (nombre_equipo) => {
  const [rows] = await pool.query(
    `
    SELECT id_equipo
    FROM equipos
    WHERE nombre_equipo = ?
      AND activo = 1
    `,
    [nombre_equipo]
  );

  return rows.length > 0;
};

/**
 * ==========================================================
 * Registrar un nuevo equipo
 * ==========================================================
 */
export const crearEquipoModel = async (equipo) => {

  const {
    id_usuario,
    nombre_equipo,
    escudo
  } = equipo;

  const [resultado] = await pool.query(
    `
    INSERT INTO equipos
    (
      id_usuario,
      escudo,
      nombre_equipo
    )
    VALUES (?, ?, ?)
    `,
    [
      id_usuario,
      escudo,
      nombre_equipo
    ]
  );

  return resultado.insertId;
};

/**
 * ==========================================================
 * Actualizar información del equipo
 * ==========================================================
 */
export const actualizarEquipoModel = async (id_equipo, equipo) => {

  const {
    nombre_equipo,
    escudo
  } = equipo;

  await pool.query(
    `
    UPDATE equipos
    SET
      nombre_equipo = ?,
      escudo = ?
    WHERE id_equipo = ?
    `,
    [
      nombre_equipo,
      escudo,
      id_equipo
    ]
  );

  return true;
};

/**
 * ==========================================================
 * Desactivar un equipo
 * ==========================================================
 */
export const desactivarEquipoModel = async (id_equipo) => {

  await pool.query(
    `
    UPDATE equipos
    SET activo = 0
    WHERE id_equipo = ?
    `,
    [id_equipo]
  );

  return true;
};