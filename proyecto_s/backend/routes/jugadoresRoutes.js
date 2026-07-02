import { Router } from "express";

import {
  createJugador,
  getJugadores,
  getJugadorById,
  updateJugador,
  deleteJugador,
  getUsuariosDisponibles
} from "../controllers/jugadoresController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jugadores
 *   description: Gestión de jugadores
 */

/**
 * @swagger
 * /api/jugadores:
 *   get:
 *     summary: Obtener todos los jugadores
 *     tags: [Jugadores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jugadores obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getJugadores);
router.get("/usuarios-disponibles", getUsuariosDisponibles);
router.get("/:id", getJugadorById);
router.put("/:id", updateJugador);

/**
 * @swagger
 * /api/jugadores/{id}:
 *   delete:
 *     summary: Eliminar un jugador
 *     tags: [Jugadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del jugador.
 *     responses:
 *       200:
 *         description: Jugador eliminado correctamente.
 *       404:
 *         description: Jugador no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", deleteJugador);

export default router;
