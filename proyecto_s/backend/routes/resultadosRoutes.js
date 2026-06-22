import { Router } from "express";

import {
  getResultados,
  getResultadoById,
  getResultadoByEncuentro,
  createResultado,
  updateResultado,
  updateResultadoPorEncuentro,
  deleteResultado,
} from "../CONTROLLERS/resultadosController.js";

const router = Router();

router.get("/encuentro/:id", getResultadoByEncuentro);

router.put("/encuentro/:id", updateResultadoPorEncuentro);

router.get("/", getResultados);

router.get("/:id", getResultadoById);

router.post("/", createResultado);

router.put("/:id", updateResultado);

router.delete("/:id", deleteResultado);

export default router;
