import { Router } from "express";

import {
  getResultados,
  getResultadoById,
  createResultado,
  updateResultado,
  deleteResultado,
} from "../CONTROLLERS/resultadosController.js";

const router = Router();

// Obtener todos
router.get("/", getResultados);

// Obtener por ID
router.get("/:id", getResultadoById);

// Crear
router.post("/", createResultado);

// Actualizar
router.put("/:id", updateResultado);

// Eliminar
router.delete("/:id", deleteResultado);

export default router;
