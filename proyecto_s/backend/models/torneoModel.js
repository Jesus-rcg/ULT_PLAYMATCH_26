import pool from "../config/db.js";

//Obtener todos los torneos
export const getTorneosModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      t.id_torneo,
      t.id_usuario,
      u.nombre_usuario,
      u.apellido_usuario,
      t.nombre_torneo,
      t.categoria,
      t.tipo_torneo,
      t.ciudad,
      t.fecha_inicio,
      t.fecha_fin,
      t.estado,
      t.activo
    FROM torneos t
    INNER JOIN usuarios u
      ON t.id_usuario = u.id_usuario
    WHERE t.activo = 1
  `);

  return rows;
};

//Obtener torneo por id del usuario
export const getTorneosByUsuarioModel = async (id_usuario) => {
  const [rows] = await pool.query(
    `
    SELECT 
      t.id_torneo,
      t.id_usuario,
      u.nombre_usuario,
      u.apellido_usuario,
      t.nombre_torneo,
      t.categoria,
      t.tipo_torneo,
      t.ciudad,
      t.fecha_inicio,
      t.fecha_fin,
      t.estado,
      t.activo
    FROM torneos t
    INNER JOIN usuarios u
      ON t.id_usuario = u.id_usuario
    WHERE t.id_usuario = ?
      AND t.activo = 1
    ORDER BY t.id_torneo DESC
    `,
    [id_usuario],
  );

  return rows;
};

//Crear torneo
export const createTorneoModel = async (torneo) => {
  const {
    id_usuario,
    nombre_torneo,
    categoria,
    tipo_torneo,
    ciudad,
    fecha_inicio,
    fecha_fin,
  } = torneo;

  // fecha actual (solo YYYY-MM-DD)
  const hoy = new Date();

  if (new Date(fecha_inicio) <= hoy) {
    throw new Error("La fecha de inicio debe ser mayor a la fecha actual");
  }

  if (new Date(fecha_fin) < new Date(fecha_inicio)) {
    throw new Error("La fecha final no puede ser menor a la fecha inicial");
  }

  const [result] = await pool.query(
    `
    INSERT INTO torneos
    (
      id_usuario,
      nombre_torneo,
      categoria,
      tipo_torneo,
      ciudad,
      fecha_inicio,
      fecha_fin
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id_usuario,
      nombre_torneo,
      categoria,
      tipo_torneo,
      ciudad,
      fecha_inicio,
      fecha_fin,
    ],
  );

  await actualizarEstadoTorneoModel(result.insertId);

  return result.insertId;
};

//Eliminar el torneo
export const deleteTorneoModel = async (id) => {
  const [inscripciones] = await pool.query(
    `
    SELECT id_inscripcion_e
    FROM inscripcionesequipos
    WHERE id_torneo = ?
      AND activo = 1
    LIMIT 1
    `,
    [id],
  );

  // si existen inscripciones no dejar desactivar
  if (inscripciones.length > 0) {
    throw new Error("No se puede Eliminar el torneo, tiene equipos inscritos");
  }

  // desactivar torneo
  await pool.query(
    `
    UPDATE torneos
    SET activo = 0
    WHERE id_torneo = ?
    `,
    [id],
  );
};

//Obtener torneos por ID
export const getTorneoByIdModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      id_torneo,
      id_usuario,
      nombre_torneo,
      categoria,
      tipo_torneo,
      ciudad,
      fecha_inicio,
      fecha_fin,
      estado,
      activo
    FROM torneos
    WHERE id_torneo = ?
    `,
    [id],
  );

  return rows[0];
};

//Actualiza el estado automaticamente por las fechas
export const actualizarEstadoTorneoModel = async (id) => {
  await pool.query(
    `
    UPDATE torneos
    SET estado =
      CASE
        WHEN CURDATE() < fecha_inicio THEN 'Inscripciones Abiertas'
        WHEN CURDATE() BETWEEN fecha_inicio AND fecha_fin THEN 'Comenzo'
        WHEN CURDATE() > fecha_fin THEN 'Finalizado'
      END
    WHERE id_torneo = ?
    `,
    [id],
  );
};

//Actualizar torneo
export const updateTorneoModel = async (id, torneo) => {
  const {
    nombre_torneo,
    categoria,
    tipo_torneo,
    ciudad,
    fecha_inicio,
    fecha_fin,
  } = torneo;

  await pool.query(
    `UPDATE torneos 
     SET nombre_torneo = ?, 
         categoria = ?, 
         tipo_torneo = ?, 
         ciudad = ?, 
         fecha_inicio = ?, 
         fecha_fin = ? 
     WHERE id_torneo = ?`,
    [
      nombre_torneo,
      categoria,
      tipo_torneo,
      ciudad,
      fecha_inicio,
      fecha_fin,
      id,
    ],
  );

  await actualizarEstadoTorneoModel(id);
  return { message: "Torneo actualizado" };
};
