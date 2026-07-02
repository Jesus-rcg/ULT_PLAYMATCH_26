import express from "express";

import {
  getInscripcionesJugadores,
  getByEquipo,
  getSolicitudesByEquipo,
  getInscripcionJugadorById,
  createInscripcionJugador,
  updateEstadoJugador,
  deleteInscripcionJugador,
} from "../controllers/inscripcionJugadoresController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inscripciones Jugadores
 *   description: Gestión de inscripciones de jugadores en equipos
 */

/**
 * @swagger
 * /api/inscripcionJugadores:
 *   get:
 *     summary: Obtener todas las inscripciones de jugadores
 *     tags: [Inscripciones Jugadores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscripciones de jugadores.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getInscripcionesJugadores);

/**
 * @swagger
 * /api/inscripcionJugadores/equipo/{id}:
 *   get:
 *     summary: Obtener inscripciones por equipo
 *     tags: [Inscripciones Jugadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo.
 *     responses:
 *       200:
 *         description: Inscripciones encontradas.
 *       404:
 *         description: Equipo no encontrado.
 */
router.get("/equipo/:id", getByEquipo);

/**
 * @swagger
 * /api/inscripcionJugadores/{id}:
 *   get:
 *     summary: Obtener una inscripción de jugador por ID
 *     tags: [Inscripciones Jugadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la inscripción.
 *     responses:
 *       200:
 *         description: Inscripción encontrada.
 *       404:
 *         description: Inscripción no encontrada.
 */
router.get("/equipo/:id_equipo/solicitudes", getSolicitudesByEquipo);
router.get("/:id", getInscripcionJugadorById);

/**
 * @swagger
 * /api/inscripcionJugadores:
 *   post:
 *     summary: Inscribir un jugador en un equipo
 *     tags: [Inscripciones Jugadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InscripcionJugador'
 *     responses:
 *       201:
 *         description: Jugador inscrito correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", createInscripcionJugador);

/**
 * @swagger
 * /api/inscripcionJugadores/{id}:
 *   put:
 *     summary: Actualizar el estado de una inscripción de jugador
 *     tags: [Inscripciones Jugadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la inscripción.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 example: Inscrito
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente.
 *       404:
 *         description: Inscripción no encontrada.
 */
router.put("/:id", updateEstadoJugador);

/**
 * @swagger
 * /api/inscripcionJugadores/{id}:
 *   delete:
 *     summary: Eliminar una inscripción de jugador
 *     tags: [Inscripciones Jugadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la inscripción.
 *     responses:
 *       200:
 *         description: Inscripción eliminada correctamente.
 *       404:
 *         description: Inscripción no encontrada.
 */
router.delete("/:id", deleteInscripcionJugador);

export default router;
