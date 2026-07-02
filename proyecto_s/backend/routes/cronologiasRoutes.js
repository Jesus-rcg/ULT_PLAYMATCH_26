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

/**
 * @swagger
 * tags:
 *   name: Cronologías
 *   description: Gestión de eventos y cronologías de los encuentros
 */

/**
 * @swagger
 * /api/cronologias:
 *   get:
 *     summary: Obtener todas las cronologías
 *     description: Retorna el listado de todas las cronologías registradas.
 *     tags: [Cronologías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cronologías obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getCronologias);

/**
 * @swagger
 * /api/cronologias/{id}:
 *   get:
 *     summary: Obtener una cronología por ID
 *     description: Retorna la información de una cronología específica.
 *     tags: [Cronologías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cronología.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cronología encontrada.
 *       404:
 *         description: Cronología no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", getCronologiaById);

/**
 * @swagger
 * /api/cronologias:
 *   post:
 *     summary: Crear una cronología
 *     description: Registra un nuevo evento dentro de la cronología de un encuentro.
 *     tags: [Cronologías]
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
 *         description: Cronología creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", createCronologia);

/**
 * @swagger
 * /api/cronologias/{id}:
 *   put:
 *     summary: Actualizar una cronología
 *     description: Actualiza la información de una cronología existente.
 *     tags: [Cronologías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cronología.
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
 *         description: Cronología actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Cronología no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id", updateCronologia);

/**
 * @swagger
 * /api/cronologias/{id}:
 *   delete:
 *     summary: Eliminar una cronología
 *     description: Elimina una cronología mediante su ID.
 *     tags: [Cronologías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cronología.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cronología eliminada correctamente.
 *       404:
 *         description: Cronología no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", deleteCronologia);

/**
 * @swagger
 * /api/cronologias/encuentro/{id_encuentro}/jugadores:
 *   get:
 *     summary: Obtener jugadores de un encuentro
 *     description: Retorna los jugadores que participaron en un encuentro específico.
 *     tags: [Cronologías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_encuentro
 *         required: true
 *         description: ID del encuentro.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Jugadores obtenidos correctamente.
 *       404:
 *         description: Encuentro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/encuentro/:id_encuentro/jugadores", getJugadoresByEncuentro);

export default router;
