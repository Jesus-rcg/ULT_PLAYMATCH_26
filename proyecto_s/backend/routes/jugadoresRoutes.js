import { Router } from "express";

import {
  createJugador,
  getJugadores,
  getJugadorById,
  updateJugador,
  deleteJugador,
  getUsuariosDisponibles
} from "../controllers/jugadoresController.js";

const router = Router();

router.post("/", createJugador);
router.get("/", getJugadores);
router.get("/usuarios-disponibles", getUsuariosDisponibles);
router.get("/:id", getJugadorById);
router.put("/:id", updateJugador);
router.delete("/:id", deleteJugador);

export default router;
