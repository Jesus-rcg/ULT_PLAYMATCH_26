import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET no está definido en .env");
}

export const generarToken = (user) => {
  return jwt.sign(
    {
      id_usuario: user.id_usuario,
      email: user.email,
      rol: user.rol ?? user.id_rol,
    },
    SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "2h",
    },
  );
};

export const verificarTokenJWT = (token) => {
  return jwt.verify(token, SECRET);
};
