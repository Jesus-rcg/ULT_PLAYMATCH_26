/**
 * ==========================================================
 * MÓDULO: INSCRIPCIÓN DE EQUIPOS
 
 * ==========================================================
 */

import pool from "../config/db.js";

/**
 * ==========================================================
 * OBTENER TODAS LAS INSCRIPCIONES
 * ==========================================================
 */
export const obtenerInscripcionesModel = async () => {
  const [rows] = await pool.query(`
    SELECT
      ie.id_inscripcion_e,
      ie.id_torneo,
      t.nombre_torneo,
      ie.id_equipo,
      e.nombre_equipo,
      ie.fecha_ins_equipo,
      ie.estado,
      ie.activo
    FROM inscripcionesequipos ie
    INNER JOIN torneos t
      ON ie.id_torneo = t.id_torneo
    INNER JOIN equipos e
      ON ie.id_equipo = e.id_equipo
    WHERE ie.activo = 1
    ORDER BY ie.id_inscripcion_e DESC
  `);

  return rows;
};

/**
 * ==========================================================
 * OBTENER INSCRIPCIÓN POR ID
 * ==========================================================
 */
export const obtenerInscripcionPorIdModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      ie.id_inscripcion_e,
      ie.id_torneo,
      t.nombre_torneo,
      ie.id_equipo,
      e.nombre_equipo,
      ie.fecha_ins_equipo,
      ie.estado,
      ie.activo
    FROM inscripcionesequipos ie
    INNER JOIN torneos t
      ON ie.id_torneo = t.id_torneo
    INNER JOIN equipos e
      ON ie.id_equipo = e.id_equipo
    WHERE ie.id_inscripcion_e = ?
    `,
    [id]
  );

  return rows[0];
};

/**
 * ==========================================================
 * OBTENER INSCRIPCIONES POR TORNEO
 * ==========================================================
 */
export const obtenerInscripcionesPorTorneoModel = async (id_torneo) => {
  const [rows] = await pool.query(
    `
    SELECT
      ie.id_inscripcion_e,
      e.nombre_equipo,
      ie.estado,
      ie.fecha_ins_equipo
    FROM inscripcionesequipos ie
    INNER JOIN equipos e
      ON ie.id_equipo = e.id_equipo
    WHERE ie.id_torneo = ?
      AND ie.activo = 1
    ORDER BY ie.fecha_ins_equipo DESC
    `,
    [id_torneo]
  );

  return rows;
};

/**
 * ==========================================================
 * OBTENER INSCRIPCIONES POR EQUIPO
 * ==========================================================
 */
export const obtenerInscripcionesPorEquipoModel = async (id_equipo) => {
  const [rows] = await pool.query(
    `
    SELECT
      ie.id_inscripcion_e,
      t.nombre_torneo,
      ie.estado,
      ie.fecha_ins_equipo
    FROM inscripcionesequipos ie
    INNER JOIN torneos t
      ON ie.id_torneo = t.id_torneo
    WHERE ie.id_equipo = ?
      AND ie.activo = 1
    ORDER BY ie.fecha_ins_equipo DESC
    `,
    [id_equipo]
  );

  return rows;
};

/**
 * ==========================================================
 * VALIDAR SI EL EQUIPO PERTENECE AL DT
 * ==========================================================
 */
export const validarEquipoUsuarioModel = async (
  id_equipo,
  id_usuario
) => {
  const [rows] = await pool.query(
    `
    SELECT id_equipo
    FROM equipos
    WHERE id_equipo = ?
      AND id_usuario = ?
      AND activo = 1
    `,
    [id_equipo, id_usuario]
  );

  return rows.length > 0;
};

/**
 * ==========================================================
 * VALIDAR QUE EL TORNEO ESTÉ ABIERTO
 * ==========================================================
 */
export const validarTorneoAbiertoModel = async (id_torneo) => {
  const [rows] = await pool.query(
    `
    SELECT id_torneo
    FROM torneos
    WHERE id_torneo = ?
      AND estado = 'Inscripciones Abiertas'
      AND activo = 1
    `,
    [id_torneo]
  );

  return rows.length > 0;
}; 
/**
 * ==========================================================
 * VALIDAR INSCRIPCIÓN DUPLICADA
 * Un equipo no puede inscribirse dos veces
 * al mismo torneo.
 * ==========================================================
 */
export const validarInscripcionDuplicadaModel = async (
  id_torneo,
  id_equipo
) => {
  const [rows] = await pool.query(
    `
    SELECT id_inscripcion_e
    FROM inscripcionesequipos
    WHERE id_torneo = ?
      AND id_equipo = ?
      AND activo = 1
    `,
    [id_torneo, id_equipo]
  );

  return rows.length > 0;
};

/**
 * ==========================================================
 * CREAR INSCRIPCIÓN
 * Estado inicial: Pendiente
 * ==========================================================
 */
export const crearInscripcionModel = async (inscripcion) => {

  const {
    id_torneo,
    id_equipo,
  } = inscripcion;

  const [result] = await pool.query(
    `
    INSERT INTO inscripcionesequipos
    (
      id_torneo,
      id_equipo,
      estado
    )
    VALUES
    (
      ?,
      ?,
      'Pendiente'
    )
    `,
    [
      id_torneo,
      id_equipo,
    ]
  );

  return result.insertId;
};

/**
 * ==========================================================
 * ACTUALIZAR ESTADO DE INSCRIPCIÓN
 * Solo permite:
 * Pendiente -> Inscrito
 * Pendiente -> Cancelado
 * ==========================================================
 */
export const actualizarEstadoInscripcionModel = async (
  id_inscripcion,
  estado
) => {

  await pool.query(
    `
    UPDATE inscripcionesequipos
    SET estado = ?
    WHERE id_inscripcion_e = ?
    `,
    [
      estado,
      id_inscripcion,
    ]
  );

  return {
    message: "Estado actualizado correctamente."
  };

};

/**
 * ==========================================================
 * DESACTIVAR INSCRIPCIÓN
 * Eliminación lógica
 * ==========================================================
 */
export const desactivarInscripcionModel = async (
  id_inscripcion
) => {

  await pool.query(
    `
    UPDATE inscripcionesequipos
    SET activo = 0
    WHERE id_inscripcion_e = ?
    `,
    [
      id_inscripcion,
    ]
  );

  return {
    message: "Inscripción eliminada correctamente."
  };

};
/**
 * ==========================================================
 * VALIDAR SI EL USUARIO ES EL ORGANIZADOR DEL TORNEO
 *  Solo el organizador del torneo puede aprobar
 * o cancelar una inscripción.
 * ==========================================================
 */
export const validarOrganizadorTorneoModel = async (
  id_torneo,
  id_usuario
) => {
  const [rows] = await pool.query(
    `
    SELECT id_torneo
    FROM torneos
    WHERE id_torneo = ?
      AND id_usuario = ?
    `,
    [id_torneo, id_usuario]
  );

  return rows.length > 0;
};