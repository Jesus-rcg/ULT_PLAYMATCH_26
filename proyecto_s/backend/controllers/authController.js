import {
  registrarUsuarioService,
  loginUsuarioService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService.js";

/* REGISTRO */
export const registrarUsuario = async (req, res) => {
  try {
    await registrarUsuarioService(req.body);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* LOGIN */
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await loginUsuarioService(email, password);

    return res.json({
      success: true,
      token: data.token,
      user: data.user,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
  try {
    await forgotPasswordService(req.body.email);

    return res.json({
      success: true,
      message: "Link de recuperación generado",
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    await resetPasswordService(token, password);

    return res.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};
