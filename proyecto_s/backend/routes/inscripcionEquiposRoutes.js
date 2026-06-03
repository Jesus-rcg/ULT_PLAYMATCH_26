import express from "express";
import {
  getInscripciones,
  getByTorneo,
  getInscripcionById,
  createInscripcion,
  updateEstado,
  deleteInscripcion,
} from "../controllers/inscripcionEquiposController.js";

const router = express.Router();

router.get("/", getInscripciones);
router.get("/torneo/:id", getByTorneo);
router.get("/:id", getInscripcionById);
router.post("/", createInscripcion);
router.put("/:id", updateEstado);
router.delete("/:id", deleteInscripcion);

export default router;
