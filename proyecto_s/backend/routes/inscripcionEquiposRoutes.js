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

/**
 * @swagger
 * tags:
 *   name: Inscripciones Equipos
 *   description: Gestión de inscripciones de equipos a torneos
 */

/**
 * @swagger
 * /api/inscripcionEquipos:
 *   get:
 *     summary: Obtener todas las inscripciones de equipos
 *     tags: [Inscripciones Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscripciones.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getInscripciones);

/**
 * @swagger
 * /api/inscripcionEquipos/torneo/{id}:
 *   get:
 *     summary: Obtener las inscripciones de un torneo
 *     tags: [Inscripciones Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del torneo
 *     responses:
 *       200:
 *         description: Inscripciones encontradas.
 *       404:
 *         description: Torneo no encontrado.
 */
router.get("/torneo/:id", getByTorneo);

/**
 * @swagger
 * /api/inscripcionEquipos/{id}:
 *   get:
 *     summary: Obtener una inscripción por ID
 *     tags: [Inscripciones Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la inscripción
 *     responses:
 *       200:
 *         description: Inscripción encontrada.
 *       404:
 *         description: Inscripción no encontrada.
 */
router.get("/:id", getInscripcionById);

/**
 * @swagger
 * /api/inscripcionEquipos:
 *   post:
 *     summary: Crear una inscripción de equipo
 *     tags: [Inscripciones Equipos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InscripcionEquipo'
 *     responses:
 *       201:
 *         description: Inscripción creada correctamente.
 *       400:
 *         description: Datos inválidos.
 */
router.post("/", createInscripcion);

/**
 * @swagger
 * /api/inscripcionEquipos/{id}:
 *   put:
 *     summary: Actualizar el estado de una inscripción
 *     tags: [Inscripciones Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la inscripción
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
 *                 example: Aprobada
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente.
 *       404:
 *         description: Inscripción no encontrada.
 */
router.put("/:id", updateEstado);

/**
 * @swagger
 * /api/inscripcionEquipos/{id}:
 *   delete:
 *     summary: Eliminar una inscripción
 *     tags: [Inscripciones Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la inscripción
 *     responses:
 *       200:
 *         description: Inscripción eliminada correctamente.
 *       404:
 *         description: Inscripción no encontrada.
 */
router.delete("/:id", deleteInscripcion);

export default router;
