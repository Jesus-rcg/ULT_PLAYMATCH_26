import db from "../config/db.js";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

//Crear usuario
export const createUsuario = async (data) => {
  const {
    id_usuario,
    id_documento,
    id_rol,
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento,
    telefono,
    email,
    password,
  } = data;

  const passwordHash = await bcrypt.hash(password, 10);

  return await pool.query(
    `INSERT INTO usuarios 
    (id_usuario, id_documento, id_rol, nombre_usuario, apellido_usuario, fecha_nacimiento, telefono, email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_usuario,
      id_documento,
      id_rol,
      nombre_usuario,
      apellido_usuario,
      fecha_nacimiento,
      telefono,
      email,
      passwordHash,
    ],
  );
};

//Buscar por ID
export const findUsuarioById = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_usuario AS id,
      id_documento,
      id_rol,
      nombre_usuario,
      apellido_usuario,
      telefono,
      fecha_nacimiento,
      email,
      id_rol AS rol
     FROM usuarios
     WHERE id_usuario = ?`,
    [id],
  );

  return rows.length ? rows[0] : null;
};

export const findUsuarioByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);

  return rows[0];
};

//Obtener todas
export const getAllUsuarios = async () => {
  const [rows] = await db.query(`
    SELECT 
      u.id_usuario AS id,
      u.id_documento,
      u.id_rol,
      u.nombre_usuario,
      u.apellido_usuario,
      u.telefono,
      u.fecha_nacimiento,
      u.email,
      t.nombre_documento,
      r.nombre_rol,
      u.activo
    FROM usuarios u
    INNER JOIN roles r
      ON u.id_rol = r.id_rol
    INNER JOIN tipodocumento t
      ON u.id_documento = t.id_documento
    WHERE u.activo = 1
    ORDER BY u.id_usuario ASC
  `);

  return rows;
};

export const getUsuariosDisponiblesModel = async () => {

  const [rows] = await db.query(`
    SELECT u.*
    FROM usuarios u
    WHERE u.id_usuario NOT IN (
        SELECT j.id_usuario
        FROM jugadores j
    )
  `);

  return rows;
};
//Actualizar usuario
export const updateUsuarioModel = async (id, data) => {
  const { id_rol, nombre_usuario, apellido_usuario, telefono, email, password } = data;

  const passwordHash = password ? await bcrypt.hash(password, 10) : null;

  const query = password
    ? `UPDATE usuarios 
     SET id_rol = ?
          nombre_usuario = ?,
          apellido_usuario = ?,
          telefono = ?,
          email = ?,
          password = ?
     WHERE id_usuario = ?`
    : `UPDATE usuarios
      SET id_rol = ?,
          nombre_usuario = ?,
          apellido_usuario = ?,
          telefono = ?,
          email = ?
      WHERE id_usuario = ?`;

  const params = passwordHash
    ? [id_rol, nombre_usuario, apellido_usuario, telefono, email, passwordHash, id]
    : [id_rol, nombre_usuario, apellido_usuario, telefono, email, id];

  const [result] = await db.query(query, params);

  if (result.affectedRows === 0) {
    throw new Error("Usuario no encontrado");
  }

  return result;
};

//Eliminar usuario
export const deleteUsuarioModel = async (id) => {
  return await db.query(
    `UPDATE usuarios 
     SET activo = 0
     WHERE id_usuario = ?`,
    [id],
  );
};


