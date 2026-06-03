import { Router } from "express";
import { getTablaPosicionesController } from "../controllers/posicionesController.js";

const router = Router();

// GET /api/posiciones/torneo/1
router.get("/torneo/:id_torneo", getTablaPosicionesController);

export default router;
