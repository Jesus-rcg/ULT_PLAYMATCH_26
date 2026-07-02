// ROUTES/encuentrosRoutes.js

import { Router } from "express";

import {
  getEncuentros,
  getEncuentroById,
  getEncuentroDetalleById,
  createEncuentro,
  updateEncuentro,
  deleteEncuentro,
  generarEncuentrosAutomaticos,
  getEncuentrosByTorneo,
  actualizarEstadoEncuentro,
} from "../CONTROLLERS/encuentrosController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Encuentros
 *   description: Gestión de encuentros y fixture del torneo
 */

/**
 * @swagger
 * /api/encuentros:
 *   get:
 *     summary: Obtener todos los encuentros
 *     description: Retorna la lista de todos los encuentros registrados.
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de encuentros obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getEncuentros);

/**
 * @swagger
 * /api/encuentros/{id}/estado:
 *   put:
 *     summary: Actualizar el estado de un encuentro
 *     description: Cambia el estado de un encuentro (Pendiente, En juego, Finalizado, etc.).
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del encuentro.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Encuentro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id/estado", actualizarEstadoEncuentro);

/**
 * @swagger
 * /api/encuentros/generar-fixture:
 *   post:
 *     summary: Generar fixture automáticamente
 *     description: Genera automáticamente los encuentros de un torneo.
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Fixture generado correctamente.
 *       400:
 *         description: No fue posible generar el fixture.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/generar-fixture", generarEncuentrosAutomaticos);

/**
 * @swagger
 * /api/encuentros/torneo/{id}:
 *   get:
 *     summary: Obtener encuentros por torneo
 *     description: Retorna todos los encuentros pertenecientes a un torneo.
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del torneo.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuentros obtenidos correctamente.
 *       404:
 *         description: Torneo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/torneo/:id", getEncuentrosByTorneo);

/**
 * @swagger
 * /api/encuentros/detalle/{id}:
 *   get:
 *     summary: Obtener detalle de un encuentro
 *     description: Retorna toda la información detallada de un encuentro.
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del encuentro.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del encuentro obtenido correctamente.
 *       404:
 *         description: Encuentro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/detalle/:id", getEncuentroDetalleById);

/**
 * @swagger
 * /api/encuentros/{id}:
 *   get:
 *     summary: Obtener un encuentro por ID
 *     description: Retorna la información de un encuentro específico.
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del encuentro.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuentro encontrado.
 *       404:
 *         description: Encuentro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", getEncuentroById);

/**
 * @swagger
 * /api/encuentros:
 *   post:
 *     summary: Crear un encuentro
 *     description: Registra un nuevo encuentro.
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Encuentro creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", createEncuentro);

/**
 * @swagger
 * /api/encuentros/{id}:
 *   put:
 *     summary: Actualizar un encuentro
 *     description: Actualiza la información de un encuentro existente.
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del encuentro.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Encuentro actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Encuentro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id", updateEncuentro);

/**
 * @swagger
 * /api/encuentros/{id}:
 *   delete:
 *     summary: Eliminar un encuentro
 *     description: Elimina un encuentro mediante su ID.
 *     tags: [Encuentros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del encuentro.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuentro eliminado correctamente.
 *       404:
 *         description: Encuentro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", deleteEncuentro);

export default router;
