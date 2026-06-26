import db from "../config/db.js";
import bcrypt from "bcrypt";

//Crear usario
export const createUsuario = async (data) => {
  const {
    id_rol,
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento,
    telefono,
    email,
    password,
  } = data;

  const passwordHash = await bcrypt.hash(password, 10);

  return await db.query(
    `INSERT INTO usuarios 
    (id_rol, nombre_usuario, apellido_usuario, fecha_nacimiento, telefono, email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
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
      nombre_usuario,
      apellido_usuario,
      email,
      telefono,
      fecha_nacimiento,
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
      u.nombre_usuario,
      u.apellido_usuario,
      u.email,
      u.telefono,
      u.fecha_nacimiento,
      u.id_rol,
      r.nombre_rol,
      u.activo
    FROM usuarios u
    INNER JOIN roles r
      ON u.id_rol = r.id_rol
    WHERE u.activo = 1
    ORDER BY u.id_usuario ASC
  `);

  return rows;
};

//Actualizar usuario
export const updateUsuarioModel = async (id, data) => {
  const { nombre_usuario, apellido_usuario, telefono, email, password } = data;

  const passwordHash = password ? await bcrypt.hash(password, 10) : null;

  const query = password
    ? `UPDATE usuarios 
     SET nombre_usuario = ?,
         apellido_usuario = ?,
          telefono = ?,
          email = ?,
          password = ?
     WHERE id_usuario = ?`
    : `UPDATE usuarios
      SET nombre_usuario = ?,
          apellido_usuario = ?,
          telefono = ?,
          email = ?
      WHERE id_usuario = ?`;

  const params = passwordHash
    ? [nombre_usuario, apellido_usuario, telefono, email, passwordHash, id]
    : [nombre_usuario, apellido_usuario, telefono, email, id];

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
