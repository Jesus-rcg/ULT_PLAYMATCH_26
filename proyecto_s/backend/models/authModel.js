import db from "../config/db.js";

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
      password,
    ],
  );
};

//Buscar por email
export const findUsuarioByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT 
      id_usuario,
      nombre_usuario,
      apellido_usuario,
      email,
      password,
      id_rol,
      activo
     FROM usuarios
     WHERE email = ?`,
    [email],
  );

  return rows[0];
};

//Actualizar password
export const updatePasswordModel = async (id, password) => {
  return await db.query(
    `UPDATE usuarios 
     SET password = ?
     WHERE id_usuario = ?`,
    [password, id],
  );
};
