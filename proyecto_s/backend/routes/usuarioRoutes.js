import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  createUsuario,
  registrarUsuario,
  enviarCodigoRegistro,
  reenviarCodigoRegistro,
  recuperarPassword,
  verificarCodigoRecuperacion,
  actualizarPassword,
} from "../controllers/usuarioController.js";

import { findUsuarioByEmail } from "../models/usuarioModel.js";

const router = express.Router();

// VALIDAR EMAIL
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const usuario = await findUsuarioByEmail(email);

    res.json({
      existe: !!usuario,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      existe: false,
      message: "Error verificando email",
    });
  }
});

// CRUD
router.post("/", createUsuario);
router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
router.post("/registrar", registrarUsuario);
router.post("/enviar-codigo", enviarCodigoRegistro);
router.post("/reenviar-codigo", reenviarCodigoRegistro);
router.post("/recuperar", recuperarPassword);
router.post("/verificar-recuperacion", verificarCodigoRecuperacion);
router.post("/cambiar-password", actualizarPassword);

export default router;