import db from "../config/db.js";

//Obtener todas
export const getAllInscripcionesJugadores = async () => {
  const [rows] = await db.query(`
    SELECT 
      ij.id_inscripcion_j,
      ij.id_equipo,
      e.nombre_equipo,
      ij.id_jugador,
      u.nombre_usuario AS nombre,
      j.posicion,
      j.numero_camiseta,
      ij.fecha_inscripcion,

      CASE 
        WHEN j.activo = 0 THEN 'Cancelado'
        ELSE ij.estado
      END AS estado,

      ij.activo
    FROM inscripcionesjugadores ij
    INNER JOIN equipos e 
      ON ij.id_equipo = e.id_equipo
    INNER JOIN jugadores j 
      ON ij.id_jugador = j.id_jugador
    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario
    WHERE ij.activo = 1
    ORDER BY ij.id_inscripcion_j ASC
  `);

  return rows;
};

//Obtenr por equipo
export const getByEquipo = async (id_equipo) => {
  const [rows] = await db.query(
    `
    SELECT 
      j.id_jugador,
      u.nombre_usuario,
      u.apellido_usuario,
      j.posicion,
      j.numero_camiseta,
      ij.id_equipo

    FROM inscripcionesjugadores ij

    INNER JOIN jugadores j
      ON ij.id_jugador = j.id_jugador

    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario

    WHERE ij.id_equipo = ?
      AND ij.estado = 'Inscrito'
      AND ij.activo = 1
      AND j.activo = 1

    ORDER BY j.numero_camiseta ASC
    `,
    [id_equipo],
  );

  return rows;
};

//Obtener por ID
export const getInscripcionJugadorById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      ij.id_inscripcion_j,
      ij.id_equipo,
      e.nombre_equipo,
      ij.id_jugador,
      u.nombre_usuario AS nombre,
      j.posicion,
      j.numero_camiseta,
      ij.fecha_inscripcion,
      ij.estado,
      ij.activo
    FROM inscripcionesjugadores ij
    INNER JOIN equipos e 
      ON ij.id_equipo = e.id_equipo
    INNER JOIN jugadores j 
      ON ij.id_jugador = j.id_jugador
    INNER JOIN usuarios u
      ON j.id_usuario = u.id_usuario
    WHERE ij.id_inscripcion_j = ?
    LIMIT 1
    `,
    [id],
  );

  return rows[0];
};

//Crear inscripcion
export const createInscripcionJugador = async (
  id_equipo,
  id_jugador,
  estado,
) => {
  const [exist] = await db.query(
    `
    SELECT * 
    FROM inscripcionesjugadores
    WHERE id_equipo = ? AND id_jugador = ?
    `,
    [id_equipo, id_jugador],
  );

  if (exist.length > 0) {
    throw new Error("Este jugador ya está inscrito en este equipo");
  }

  const [result] = await db.query(
    `
    INSERT INTO inscripcionesjugadores 
    (id_equipo, id_jugador, estado)
    VALUES (?, ?, ?)
    `,
    [id_equipo, id_jugador, estado],
  );

  return result;
};

//Actualizar estado jugador
export const updateEstadoJugador = async (id_inscripcion_j, estado) => {
  const [result] = await db.query(
    `
    UPDATE inscripcionesjugadores ij
    JOIN jugadores j 
      ON ij.id_jugador = j.id_jugador
    SET ij.estado = CASE
      WHEN j.activo = 1 THEN ?
      ELSE 'Cancelado'
    END
    WHERE ij.id_inscripcion_j = ?
    `,
    [estado, id_inscripcion_j],
  );

  return result;
};

//Cambiar estado de jugador
export const cambiarEstadoJugador = async (id_jugador, activo) => {
  await db.query(
    `
    UPDATE jugadores 
    SET activo = ?
    WHERE id_jugador = ?
    `,
    [activo, id_jugador],
  );

  if (activo == 0) {
    await db.query(
      `
      UPDATE inscripcionesjugadores
      SET estado = 'Cancelado'
      WHERE id_jugador = ?
      `,
      [id_jugador],
    );
  }
};

//Eliminar
export const deleteInscripcionJugador = async (id_inscripcion_j) => {
  const [result] = await db.query(
    `
    UPDATE inscripcionesjugadores
    SET activo = 0
    WHERE id_inscripcion_j = ?
    `,
    [id_inscripcion_j],
  );

  return result;
};
