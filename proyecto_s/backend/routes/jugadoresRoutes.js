import { Router } from "express";

import {
  getJugadores,
  getJugadorById,
  createJugador,
  updateJugador,
  deleteJugador,
} from "../controllers/jugadoresController.js";

const router = Router();

router.get("/", getJugadores);
router.get("/:id", getJugadorById);
router.post("/", createJugador);
router.put("/:id", updateJugador);
router.delete("/:id", deleteJugador);

export default router;
