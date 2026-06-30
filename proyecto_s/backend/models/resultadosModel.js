import pool from "../config/db.js";

// Obtener todos
export const getResultadosModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      r.id_resultado,
      r.id_encuentro,
      r.goles_local,
      r.goles_visitante,

      e.fecha,

      e.id_equipo_local,
      local.nombre_equipo AS equipo_local,

      e.id_equipo_visitante,
      visitante.nombre_equipo AS equipo_visitante

    FROM resultados r

    INNER JOIN encuentros e
      ON r.id_encuentro = e.id_encuentroi

    INNER JOIN equipos local
      ON e.id_equipo_local = local.id_equipo

    INNER JOIN equipos visitante
      ON e.id_equipo_visitante = visitante.id_equipo

    ORDER BY r.id_resultado DESC
  `);

  return rows;
};

// Obtener por ID
export const getResultadoByIdModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM resultados
    WHERE id_resultado = ?
  `,
    [id],
  );

  return rows[0];
};

// Crear
export const createResultadoModel = async (resultado) => {
  const { id_encuentro, goles_local, goles_visitante } = resultado;

  const [result] = await pool.query(
    `
    INSERT INTO resultados
    (id_encuentro, goles_local, goles_visitante)
    VALUES (?, ?, ?)
  `,
    [id_encuentro, goles_local, goles_visitante],
  );

  return result;
};

// Actualizar
export const updateResultadoModel = async (id, resultado) => {
  const { id_encuentro, goles_local, goles_visitante } = resultado;

  const [result] = await pool.query(
    `
    UPDATE resultados
    SET
      id_encuentro = ?,
      goles_local = ?,
      goles_visitante = ?
    WHERE id_resultado = ?
  `,
    [id_encuentro, goles_local, goles_visitante, id],
  );

  return result;
};

// Eliminar
export const deleteResultadoModel = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM resultados
    WHERE id_resultado = ?
  `,
    [id],
  );

  return result;
};

export const getResultadoByEncuentroModel = async (idEncuentro) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM resultados
    WHERE id_encuentro = ?
    `,
    [idEncuentro],
  );

  return rows[0];
};

export const sumarGolResultadoModel = async (idEncuentro, equipo) => {
  const campo = equipo === "A" ? "goles_local" : "goles_visitante";

  const [result] = await pool.query(
    `
    UPDATE resultados
    SET ${campo} = ${campo} + 1
    WHERE id_encuentro = ?
    `,
    [idEncuentro],
  );

  return result;
};
