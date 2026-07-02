import { Router } from "express";
import { getTablaPosicionesController } from "../controllers/posicionesController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posiciones
 *   description: Tabla de posiciones de los torneos
 */

/**
 * @swagger
 * /api/posiciones/torneo/{id_torneo}:
 *   get:
 *     summary: Obtener la tabla de posiciones de un torneo
 *     description: Devuelve la tabla de posiciones de todos los equipos inscritos en un torneo.
 *     tags: [Posiciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_torneo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del torneo.
 *     responses:
 *       200:
 *         description: Tabla de posiciones obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posicion'
 *       404:
 *         description: Torneo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/torneo/:id_torneo", getTablaPosicionesController);

export default router;
