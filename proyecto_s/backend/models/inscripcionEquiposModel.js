import db from "../config/db.js";

//Obtener todas
export const getAllInscripciones = async () => {
  const [rows] = await db.query(`
    SELECT 
      i.id_inscripcion_e,
      i.id_torneo,
      t.nombre_torneo,
      i.id_equipo,
      e.nombre_equipo,
      i.fecha_ins_equipo,

      -- ESTADO REAL
      CASE 
        WHEN e.activo = 0 THEN 'Cancelado'
        ELSE i.estado
      END AS estado,

      i.activo
    FROM inscripcionesequipos i
    INNER JOIN torneos t ON i.id_torneo = t.id_torneo
    INNER JOIN equipos e ON i.id_equipo = e.id_equipo
    WHERE i.activo = 1
    ORDER BY i.id_inscripcion_e ASC
  `);

  return rows;
};

//Obtener por torneo
export const getByTorneo = async (id_torneo) => {
  const [rows] = await db.query(
    `SELECT * FROM inscripcionesequipos WHERE id_torneo = ?`,
    [id_torneo],
  );

  return rows;
};

//Obtener por ID
export const getInscripcionById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      i.id_inscripcion_e,
      i.id_torneo,
      t.nombre_torneo,
      i.id_equipo,
      e.nombre_equipo,
      i.fecha_ins_equipo,
      i.estado,
      i.activo
    FROM inscripcionesequipos i
    INNER JOIN torneos t ON i.id_torneo = t.id_torneo
    INNER JOIN equipos e ON i.id_equipo = e.id_equipo
    WHERE i.id_inscripcion_e = ?
    LIMIT 1
    `,
    [id],
  );

  return rows[0];
};

//Crear inscripcion
export const createInscripcion = async (id_torneo, id_equipo, estado) => {
  const [exist] = await db.query(
    `
    SELECT * FROM inscripcionesequipos
    WHERE id_torneo = ? AND id_equipo = ?
    `,
    [id_torneo, id_equipo],
  );

  if (exist.length > 0) {
    throw new Error("Este equipo ya está inscrito en este torneo");
  }

  const [result] = await db.query(
    `
    INSERT INTO inscripcionesequipos (id_torneo, id_equipo, estado)
    VALUES (?, ?, ?)
    `,
    [id_torneo, id_equipo, estado],
  );

  return result;
};

//Cambiar estado
export const updateEstado = async (id_inscripcion_e, estado) => {
  const [result] = await db.query(
    `
    UPDATE inscripcionesequipos i
    JOIN equipos e ON i.id_equipo = e.id_equipo
    SET i.estado = CASE
      WHEN e.activo = 1 THEN ?
      ELSE 'Cancelado'
    END
    WHERE i.id_inscripcion_e = ?
    `,
    [estado, id_inscripcion_e],
  );

  return result;
};

//Cambiar estado de equipo
export const cambiarEstadoEquipo = async (id_equipo, activo) => {
  // 1. actualizar equipo
  await db.query(`UPDATE equipos SET activo = ? WHERE id_equipo = ?`, [
    activo,
    id_equipo,
  ]);

  // 2. si se Elimina se cambia automaticamente el estado a cancelar inscripciones
  if (activo == 0) {
    await db.query(
      `
      UPDATE inscripcionesequipos
      SET estado = 'Cancelado'
      WHERE id_equipo = ?
      `,
      [id_equipo],
    );
  }
};

//Eliminar
export const deleteInscripcion = async (id_inscripcion_e) => {
  const [result] = await db.query(
    `
    UPDATE inscripcionesequipos
    SET activo = 0
    WHERE id_inscripcion_e = ?
    `,
    [id_inscripcion_e],
  );

  return result;
};
