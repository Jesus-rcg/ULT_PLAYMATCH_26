import { Router } from "express";

import {
  getEquipos,
  getEquipoById,
  getEquipoByUsuario,
  getEquiposByTorneo,
  createEquipo,
  updateEquipo,
  deleteEquipo,
} from "../controllers/equiposController.js";

const router = Router();

router.get("/torneo/:id", getEquiposByTorneo);

router.get("/usuario/:id_usuario", getEquipoByUsuario);

router.get("/", getEquipos);
router.get("/:id", getEquipoById);

router.post("/", createEquipo);
router.put("/:id", updateEquipo);
router.delete("/:id", deleteEquipo);

export default router;
