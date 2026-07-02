import pool from "../config/db.js";

// Obtener todos los jugadores
export const getJugadoresModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      j.id_jugador,
      j.id_usuario,
      u.nombre_usuario,
      u.apellido_usuario,
      j.posicion,
      j.numero_camiseta,
      j.activo
    FROM jugadores j
    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario
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
      u.apellido_usuario,
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

export const existeJugadorPorUsuarioModel = async (id_usuario) => {
  const [rows] = await pool.query(
    `
    SELECT id_jugador
    FROM jugadores
    WHERE id_usuario = ?
    `,
    [id_usuario]
  );

  return rows.length > 0;
};

export const createJugadorModel = async (jugador) => {
  const {
    id_usuario,
    posicion,
    numero_camiseta
  } = jugador;

  const [check] = await pool.query(
    `SELECT id_jugador FROM jugadores WHERE id_usuario = ?`,
    [id_usuario]
  );

  if (check.length > 0) {
    throw new Error("Este usuario ya tiene jugador");
  }
  
  const [result] = await pool.query(
    `
    INSERT INTO jugadores
    (id_usuario, posicion, numero_camiseta, activo)
    VALUES (?, ?, ?, ?)
    `,
    [
      id_usuario,
      posicion,
      numero_camiseta,
      1
    ]
  );

  return result;
};

// Actualizar jugador
export const updateJugadorModel = async (id, jugador) => {
  const {
    id_usuario,
    posicion,
    numero_camiseta,
    activo
  } = jugador;


  const [result] = await pool.query(
    `
    UPDATE jugadores
    SET
      id_usuario = ?,
      posicion = ?,
      numero_camiseta = ?,
      activo = ?
    WHERE id_jugador = ?
    `,
    [
      id_usuario,
      posicion,
      numero_camiseta,
      activo,
      id
    ]
  );

  return result;
};

// Eliminar jugador (borrado lógico)
export const deleteJugadorModel = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM jugadores
    WHERE id_jugador = ?
    `,
    [id],
  );

  return result;
};
