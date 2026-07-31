import db from "../config/db.js";
import bcrypt from "bcrypt";

//Crear usario
export const registrarUsuarioModel = async (data) => {
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

  const [result] = await db.query(
    
    `INSERT INTO usuarios 
    (id_usuario, id_documento, id_rol, nombre_usuario, apellido_usuario, fecha_nacimiento, telefono, email, password, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_usuario, id_documento, id_rol, nombre_usuario, apellido_usuario, fecha_nacimiento, telefono, email, passwordHash, 1],
  );

  return result;
}

//Buscar por email
export const findUsuarioByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);

  return rows[0];
};



export const cambiarPasswordModel = async (email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);

  return await db.query(
    `UPDATE usuarios 
     SET password = ?
     WHERE email = ?`,
    [passwordHash, email]
  );
};
