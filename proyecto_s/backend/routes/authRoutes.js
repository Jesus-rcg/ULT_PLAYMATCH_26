import express from "express";

import {
  loginUsuario,
  registrarUsuario,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUsuario);
router.post("/registrar", registrarUsuario);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
