import { Router } from "express";

import {
  getJugadores,
  getJugadorById,
  getUsuariosDisponibles,
  createJugador,
  updateJugador,
  deleteJugador,
} from "../controllers/jugadoresController.js";

const router = Router();

router.get("/", getJugadores);
router.get("/:id", getJugadorById);
router.get("/usuarios-disponibles", getUsuariosDisponibles);
router.post("/", createJugador);
router.put("/:id", updateJugador);
router.delete("/:id", deleteJugador);

export default router;
