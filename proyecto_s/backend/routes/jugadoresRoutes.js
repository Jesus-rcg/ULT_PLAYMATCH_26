/**
 * ==========================================================
 *  JUGADORES
 * 
 * ==========================================================
 */

import { Router } from "express";

import {
  createJugador,
  getJugadores,
  getJugadorById,
  getJugadoresPorEquipo,
  updateJugador,
  desactivarJugador,
} from "../controllers/jugadoresController.js";

import { verificarToken } from "../middlewares/verificarToken.js";

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
router.get("/", verificarToken, getJugadores);

/**
 * @swagger
 * /api/jugadores/equipo/{id_equipo}:
 *   get:
 *     summary: Obtener jugadores activos de un equipo
 *     tags: [Jugadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_equipo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo.
 *     responses:
 *       200:
 *         description: Lista de jugadores del equipo.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/equipo/:id_equipo", verificarToken, getJugadoresPorEquipo);

/**
 * @swagger
 * /api/jugadores/{id}:
 *   get:
 *     summary: Obtener un jugador por ID
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
 *         description: Jugador encontrado.
 *       404:
 *         description: Jugador no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", verificarToken, getJugadorById);

/**
 * @swagger
 * /api/jugadores:
 *   post:
 *     summary: Crear un jugador
 *     tags: [Jugadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Jugador'
 *     responses:
 *       201:
 *         description: Jugador creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", verificarToken, createJugador);

/**
 * @swagger
 * /api/jugadores/{id}:
 *   put:
 *     summary: Actualizar un jugador
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Jugador'
 *     responses:
 *       200:
 *         description: Jugador actualizado correctamente.
 *       404:
 *         description: Jugador no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id", verificarToken, updateJugador);

/**
 * @swagger
 * /api/jugadores/{id}:
 *         description: ID del jugador.
 *     responses:
 *       200:
 *         description: Jugador desactivado correctamente.
 *       404:
 *         description: Jugador no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", verificarToken, desactivarJugador);

export default router;