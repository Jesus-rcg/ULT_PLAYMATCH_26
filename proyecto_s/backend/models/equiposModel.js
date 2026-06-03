import pool from "../config/db.js";

//Obtener todos los equipos
export const getEquiposModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      e.id_equipo,
      e.id_usuario,
      u.nombre_usuario,
      e.escudo,
      e.nombre_equipo,
      e.activo
    FROM equipos e
    INNER JOIN usuarios u
      ON e.id_usuario = u.id_usuario
    WHERE e.activo = 1
    ORDER BY e.id_equipo ASC
  `);

  return rows;
};

//Obtener equipo por ID
export const getEquipoByIdModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM equipos
    WHERE id_equipo = ?
    `,
    [id],
  );

  return rows[0];
};

//Crear equipo
export const createEquipoModel = async (equipo) => {
  const { id_usuario, escudo, nombre_equipo } = equipo;

  const [result] = await pool.query(
    `
    INSERT INTO equipos
    (id_usuario, escudo, nombre_equipo)
    VALUES (?, ?, ?)
    `,
    [id_usuario, escudo, nombre_equipo],
  );

  return result;
};

//Actualizar equipo
export const updateEquipoModel = async (id, equipo) => {
  const { id_usuario, escudo, nombre_equipo } = equipo;

  const [result] = await pool.query(
    `
    UPDATE equipos
    SET
      id_usuario = ?,
      escudo = ?,
      nombre_equipo = ?
    WHERE id_equipo = ?
    `,
    [id_usuario, escudo, nombre_equipo, id],
  );

  return result;
};

//Eliminar equipo
export const deleteEquipoModel = async (id) => {
  const [result] = await pool.query(
    `
    UPDATE equipos
    SET activo = 0
    WHERE id_equipo = ?
    `,
    [id],
  );

  return result;
};
