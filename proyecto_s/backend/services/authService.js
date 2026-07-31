import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUsuarioByEmail,
  registrarUsuarioModel,
  cambiarPasswordModel
} from "../models/authModel.js";

/* REGISTRO */
//Registrar usuario
export const registrarUsuarioService = async (data) => {
  const usuario = await findUsuarioByEmail(data.email);

  if (usuario) {
    throw new Error("El email ya está registrado");
  }
  await registrarUsuarioModel(data);
};

export const cambiarPasswordService = async (email, password) => {
  const usuario  = await findUsuarioByEmail(email);

  if (!usuario) {
    throw new Error("El correo no existe");
  }
  
  await cambiarPasswordModel(email, password);

};

/* LOGIN */
export const loginUsuarioService = async (email, password) => {
  const user = await findUsuarioByEmail(email);

  if (!user) throw new Error("Credenciales incorrectas");

  if (user.activo === 0) {
    throw new Error("No se encontro el Usuario");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Credenciales incorrectas");

  delete user.password;

  // 🔥 USER NORMALIZADO
  const normalizedUser = {
    id_usuario: user.id_usuario,
    nombre_usuario: user.nombre_usuario,
    apellido_usuario: user.apellido_usuario,
    email: user.email,
    rol: user.id_rol,
  };

  const token = jwt.sign(normalizedUser, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    user: normalizedUser,
  };
};

/* FORGOT PASSWORD */
export const forgotPasswordService = async (email) => {
  const user = await findUsuarioByEmail(email);

  if (!user) throw new Error("Mensaje enviado al correo");

  const token = jwt.sign(
    { id_usuario: user.id_usuario },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  console.log("LINK RECUPERACIÓN:", link);
};

/* RESET PASSWORD */
export const resetPasswordService = async (token, password) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const hashed = await bcrypt.hash(password, 10);

  await updatePasswordModel(decoded.id_usuario, hashed);
};
