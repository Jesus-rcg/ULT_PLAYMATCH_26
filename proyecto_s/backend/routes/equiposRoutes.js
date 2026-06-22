import { Router } from "express";

import {
  getEquipos,
  getEquipoById,
  getEquiposByTorneo,
  createEquipo,
  updateEquipo,
  deleteEquipo,
} from "../controllers/equiposController.js";

const router = Router();

router.get("/torneo/:id", getEquiposByTorneo);
router.get("/", getEquipos);
router.get("/:id", getEquipoById);
router.post("/", createEquipo);
router.put("/:id", updateEquipo);
router.delete("/:id", deleteEquipo);

export default router;
