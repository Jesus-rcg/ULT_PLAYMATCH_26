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

// Crear jugador
export const createJugadorModel = async (jugador) => {

  const {
    id_usuario,
    nombre_usuario,
    apellido_usuario,
    posicion,
    numero_camiseta
  } = jugador;

  // 1. Actualizar datos del usuario
  await pool.query(
    `
    UPDATE usuarios
    SET nombre_usuario = ?,
        apellido_usuario = ?
    WHERE id_usuario = ?
    `,
    [
      nombre_usuario,
      apellido_usuario,
      id_usuario
    ]
  );

  // 2. Crear jugador
  const [result] = await pool.query(
    `
    INSERT INTO jugadores
    (id_usuario, posicion, numero_camiseta)
    VALUES (?, ?, ?)
    `,
    [
      id_usuario,
      posicion,
      numero_camiseta
    ]
  );

  return result;
};

// Actualizar jugador
export const updateJugadorModel = async (id, jugador) => {
  const {
    id_usuario,
    nombre_usuario,
    apellido_usuario,
    posicion,
    numero_camiseta,
    activo
  } = jugador;

 await pool.query(
  `
  UPDATE usuarios
  SET
    nombre_usuario = ?,
    apellido_usuario = ?
  WHERE id_usuario = ?
  `,
[
  nombre_usuario,
  apellido_usuario,
  id_usuario
]
);

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
export const getUsuariosDisponiblesModel = async () => {
  const [rows] = await pool.query(`
    SELECT
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario
    FROM usuarios u
    LEFT JOIN jugadores j
        ON u.id_usuario = j.id_usuario
    WHERE j.id_usuario IS NULL
      AND u.activo = 1
    ORDER BY u.nombre_usuario
  `);

  return rows;
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
