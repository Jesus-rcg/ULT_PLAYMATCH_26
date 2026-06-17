import db from "../config/db.js";

// Crear alineación
export const createAlineacion = async (data) => {
  const { id_equipo, nombre, activa } = data;

  const [result] = await db.query(
    `INSERT INTO alineaciones
    (id_equipo, nombre, activa)
    VALUES (?, ?, ?)`,
    [id_equipo, nombre, activa],
  );

  return result;
};

// Guardar jugadores de la alineación
export const guardarJugadores = async (jugadores) => {
  const values = jugadores.map((j) => [
    j.id_alineacion,
    j.id_jugador,
    j.posicion,
  ]);

  const [result] = await db.query(
    `INSERT INTO alineacion_jugadores
    (id_alineacion, id_jugador, posicion)
    VALUES ?`,
    [values],
  );

  return result;
};

// Obtener todas las alineaciones de un equipo
export const getAlineacionesByEquipo = async (id_equipo) => {
  const [rows] = await db.query(
    `SELECT *
     FROM alineaciones
     WHERE id_equipo = ?
     ORDER BY id_alineacion DESC`,
    [id_equipo],
  );

  return rows;
};

// Obtener una alineación
export const getAlineacionById = async (id_alineacion) => {
  const [rows] = await db.query(
    `SELECT *
     FROM alineaciones
     WHERE id_alineacion = ?`,
    [id_alineacion],
  );

  return rows[0];
};

// Obtener los jugadores de una alineación
export const getJugadoresAlineacion = async (id_alineacion) => {
  const [rows] = await db.query(
    `SELECT
        aj.posicion,
        j.id_jugador,
        j.numero_camiseta,
        j.posicion AS posicion_jugador,
        u.nombre_usuario,
        u.apellido_usuario
     FROM alineacion_jugadores aj
     INNER JOIN jugadores j
        ON aj.id_jugador = j.id_jugador
     INNER JOIN usuarios u
        ON j.id_usuario = u.id_usuario
     WHERE aj.id_alineacion = ?`,
    [id_alineacion],
  );

  return rows;
};

// Desactivar todas las alineaciones de un equipo
export const desactivarAlineaciones = async (id_equipo) => {
  await db.query(
    `UPDATE alineaciones
     SET activa = 0
     WHERE id_equipo = ?`,
    [id_equipo],
  );
};

// Activar una alineación
export const activarAlineacionModel = async (id_alineacion) => {
  await db.query(
    `UPDATE alineaciones
     SET activa = 1
     WHERE id_alineacion = ?`,
    [id_alineacion],
  );
};

// Eliminar jugadores de la alineación
export const eliminarJugadoresAlineacion = async (id_alineacion) => {
  await db.query(
    `DELETE FROM alineacion_jugadores
     WHERE id_alineacion = ?`,
    [id_alineacion],
  );
};

// Eliminar alineación
export const eliminarAlineacionModel = async (id_alineacion) => {
  await db.query(
    `DELETE FROM alineaciones
     WHERE id_alineacion = ?`,
    [id_alineacion],
  );
};
