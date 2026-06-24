import pool from "../config/db.js";

// Obtener todos los jugadores
export const getJugadoresModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      j.id_jugador,
      j.id_usuario,
      u.nombre_usuario,
      j.posicion,
      j.numero_camiseta,
      j.activo
    FROM jugadores j
    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario
    WHERE j.activo = 1
    ORDER BY j.id_jugador ASC
  `);

  return rows;
};

// Obtener jugador por ID
export const getJugadorByIdModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      j.id_jugador,
      j.id_usuario,
      u.nombre_usuario,
      j.posicion,
      j.numero_camiseta,
      j.activo
    FROM jugadores j
    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario
    WHERE j.id_jugador = ?
    `,
    [id]
  );

  return rows[0];
};

// Crear jugador
export const createJugadorModel = async (jugador) => {
  const { id_usuario, posicion, numero_camiseta } = jugador;

  const [result] = await pool.query(
    `
    INSERT INTO jugadores
    (id_usuario, posicion, numero_camiseta)
    VALUES (?, ?, ?)
    `,
    [id_usuario, posicion, numero_camiseta],
  );

  return result;
};

// Actualizar jugador
export const updateJugadorModel = async (id, jugador) => {
  const { id_usuario, posicion, numero_camiseta } = jugador;

  const [result] = await pool.query(
    `
    UPDATE jugadores
    SET
      id_usuario = ?,
      posicion = ?,
      numero_camiseta = ?
    WHERE id_jugador = ?
    `,
    [id_usuario, posicion, numero_camiseta, id],
  );

  return result;
};

// Eliminar jugador (borrado lógico)
export const deleteJugadorModel = async (id) => {
  const [result] = await pool.query(
    `
    UPDATE jugadores
    SET activo = 0
    WHERE id_jugador = ?
    `,
    [id],
  );

  return result;
};
