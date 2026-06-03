import { Router } from "express";

import {
  getCronologias,
  getCronologiaById,
  createCronologia,
  updateCronologia,
  deleteCronologia,
  getJugadoresByEncuentro,
} from "../CONTROLLERS/cronologiasController.js";

const router = Router();

// Obtener todas
router.get("/", getCronologias);

// Obtener por ID
router.get("/:id", getCronologiaById);

// Crear
router.post("/", createCronologia);

// Actualizar
router.put("/:id", updateCronologia);

// Eliminar
router.delete("/:id", deleteCronologia);

// Obtener jugadores por encuentro
router.get("/encuentro/:id_encuentro/jugadores", getJugadoresByEncuentro);

export default router;
