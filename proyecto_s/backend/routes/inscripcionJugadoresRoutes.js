import express from "express";

import {
  getInscripcionesJugadores,
  getByEquipo,
  getInscripcionJugadorById,
  createInscripcionJugador,
  updateEstadoJugador,
  deleteInscripcionJugador,
} from "../controllers/inscripcionJugadoresController.js";

const router = express.Router();

router.get("/", getInscripcionesJugadores);
router.get("/equipo/:id", getByEquipo);
router.get("/:id", getInscripcionJugadorById);
router.post("/", createInscripcionJugador);
router.put("/:id", updateEstadoJugador);
router.delete("/:id", deleteInscripcionJugador);

export default router;
