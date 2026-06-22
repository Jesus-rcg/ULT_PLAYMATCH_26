import pool from "../config/db.js";

// Obtener todas
export const getCronologiasModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      c.id_cronologia,
      c.id_encuentro,
      e.fecha,
      e.id_equipo_local,
      local.nombre_equipo AS equipo_local,
      e.id_equipo_visitante,
      visitante.nombre_equipo AS equipo_visitante,
      c.id_jugador,
      u.nombre_usuario,
      u.apellido_usuario,
      eq.nombre_equipo AS equipo_jugador,
      c.evento,
      c.minuto
    FROM cronologias c

    INNER JOIN encuentros e 
      ON c.id_encuentro = e.id_encuentro
    INNER JOIN equipos local
      ON e.id_equipo_local = local.id_equipo
    INNER JOIN equipos visitante
      ON e.id_equipo_visitante = visitante.id_equipo
    INNER JOIN jugadores j 
      ON c.id_jugador = j.id_jugador
    INNER JOIN usuarios u 
      ON j.id_usuario = u.id_usuario
    INNER JOIN inscripcionesjugadores ij
ON ij.id_jugador = j.id_jugador
AND (
    ij.id_equipo = e.id_equipo_local
    OR ij.id_equipo = e.id_equipo_visitante
)
AND ij.activo = 1
    INNER JOIN equipos eq
      ON ij.id_equipo = eq.id_equipo

    ORDER BY c.minuto ASC
  `);

  return rows;
};

// Obtener por ID
export const getCronologiaByIdModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      c.id_cronologia,
      c.id_encuentro,
      c.id_jugador,
      c.evento,
      c.minuto
    FROM cronologias c
    WHERE c.id_cronologia = ?
  `,
    [id],
  );

  return rows[0];
};

// Crear
export const createCronologiaModel = async (cronologia) => {
  const { id_encuentro, id_jugador, evento, minuto } = cronologia;

  const [result] = await pool.query(
    `
    INSERT INTO cronologias
    (id_encuentro, id_jugador, evento, minuto)
    VALUES (?, ?, ?, ?)
  `,
    [id_encuentro, id_jugador, evento, minuto],
  );

  return result;
};

// Actualizar
export const updateCronologiaModel = async (id, cronologia) => {
  const { evento } = cronologia;

  const [result] = await pool.query(
    `
    UPDATE cronologias
    SET evento = ?
    WHERE id_cronologia = ?
    `,
    [evento, id],
  );

  return result;
};

// Eliminar
export const deleteCronologiaModel = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM cronologias
    WHERE id_cronologia = ?
  `,
    [id],
  );

  return result;
};

//Obtener jugador por encuentro
export const getJugadoresByEncuentroModel = async (id_encuentro) => {
  const [rows] = await pool.query(
    `
    SELECT 
      j.id_jugador,
      u.nombre_usuario,
      u.apellido_usuario,
      eq.nombre_equipo

    FROM encuentros e

    INNER JOIN inscripcionesjugadores ij
      ON ij.id_equipo = e.id_equipo_local
      OR ij.id_equipo = e.id_equipo_visitante

    INNER JOIN jugadores j
      ON j.id_jugador = ij.id_jugador

    INNER JOIN usuarios u
      ON u.id_usuario = j.id_usuario

    INNER JOIN equipos eq
      ON eq.id_equipo = ij.id_equipo

    WHERE e.id_encuentro = ?
      AND ij.estado = 'Inscrito'
      AND ij.activo = 1
      AND j.activo = 1
    `,
    [id_encuentro],
  );

  return rows;
};
