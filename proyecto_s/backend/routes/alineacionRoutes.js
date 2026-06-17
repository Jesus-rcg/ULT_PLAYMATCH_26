import express from "express";

import {
  guardarAlineacion,
  obtenerAlineaciones,
  obtenerAlineacion,
  eliminarAlineacion,
  activarAlineacion,
} from "../controllers/alineacionController.js";

const router = express.Router();

router.post("/", guardarAlineacion);
router.get("/equipo/:id_equipo", obtenerAlineaciones);
router.get("/:id_alineacion", obtenerAlineacion);
router.put("/activar/:id_alineacion", activarAlineacion);
router.delete("/:id_alineacion", eliminarAlineacion);

export default router;
