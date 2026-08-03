import express from "express";
import {
  obtenerInscripciones,
  obtenerInscripcionPorId,
  obtenerInscripcionesPorTorneo,
  obtenerInscripcionesPorEquipo,
  crearInscripcion,
  actualizarEstadoInscripcion,
  eliminarInscripcion,
} from "../controllers/inscripcionEquiposController.js";

import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// =======================================
// OBTENER TODAS LAS INSCRIPCIONES
// =======================================
router.get("/", verificarToken, obtenerInscripciones);

// =======================================
// OBTENER INSCRIPCIÓN POR ID
// =======================================
router.get("/:id", verificarToken, obtenerInscripcionPorId);

// =======================================
// OBTENER INSCRIPCIONES POR TORNEO
// =======================================
router.get(
  "/torneo/:id_torneo",
  verificarToken,
  obtenerInscripcionesPorTorneo
);

// =======================================
// OBTENER INSCRIPCIONES POR EQUIPO
// =======================================
router.get(
  "/equipo/:id_equipo",
  verificarToken,
  obtenerInscripcionesPorEquipo
);

// =======================================
// CREAR INSCRIPCIÓN
// =======================================
router.post("/", verificarToken, crearInscripcion);

// =======================================
// ACTUALIZAR ESTADO
// =======================================
router.put(
  "/:id/estado",
  verificarToken,
  actualizarEstadoInscripcion
);

// =======================================
// ELIMINAR INSCRIPCIÓN
// =======================================
router.delete("/:id", verificarToken, eliminarInscripcion);

export default router;