// ROUTES/encuentrosRoutes.js

import { Router } from "express";

import {
  getEncuentros,
  getEncuentroById,
  getEncuentroDetalleById,
  createEncuentro,
  updateEncuentro,
  deleteEncuentro,
  generarEncuentrosAutomaticos,
  getEncuentrosByTorneo,
  actualizarEstadoEncuentro,
} from "../CONTROLLERS/encuentrosController.js";

const router = Router();

router.get("/", getEncuentros);
router.put("/:id/estado", actualizarEstadoEncuentro);
router.post("/generar-fixture", generarEncuentrosAutomaticos);
router.get("/torneo/:id", getEncuentrosByTorneo);
router.get("/detalle/:id", getEncuentroDetalleById);
router.get("/:id", getEncuentroById);
router.post("/", createEncuentro);
router.put("/:id", updateEncuentro);
router.delete("/:id", deleteEncuentro);

export default router;
