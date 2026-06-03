import express from "express";
import {
  getTorneos,
  getTorneoById,
  createTorneo,
  updateTorneo,
  deleteTorneo,
  getTorneosByUsuario,
} from "../controllers/torneoController.js";

import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// 🔥 PRIMERO rutas específicas
router.get("/usuario/mios", verificarToken, getTorneosByUsuario);

// TODOS LOS TORNEOS
router.get("/", getTorneos);

// DESPUÉS rutas dinámicas
router.get("/:id", getTorneoById);

// CREAR
router.post("/", verificarToken, createTorneo);

// ACTUALIZAR
router.put("/:id", verificarToken, updateTorneo);

// ELIMINAR
router.delete("/:id", verificarToken, deleteTorneo);

export default router;
