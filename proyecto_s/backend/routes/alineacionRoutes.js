import express from "express";

import {
  guardarAlineacion,
  obtenerAlineaciones,
  obtenerAlineacion,
  eliminarAlineacion,
  activarAlineacion,
} from "../controllers/alineacionController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Alineaciones
 *   description: Gestión de alineaciones de los equipos
 */

/**
 * @swagger
 * /api/alineaciones:
 *   post:
 *     summary: Guardar una alineación
 *     description: Registra una nueva alineación para un equipo.
 *     tags: [Alineaciones]
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
 *         description: Alineación guardada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", guardarAlineacion);

/**
 * @swagger
 * /api/alineaciones/equipo/{id_equipo}:
 *   get:
 *     summary: Obtener las alineaciones de un equipo
 *     description: Devuelve todas las alineaciones registradas para un equipo.
 *     tags: [Alineaciones]
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
 *         description: Lista de alineaciones.
 *       404:
 *         description: Equipo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/equipo/:id_equipo", obtenerAlineaciones);

/**
 * @swagger
 * /api/alineaciones/{id_alineacion}:
 *   get:
 *     summary: Obtener una alineación por ID
 *     description: Devuelve la información de una alineación específica.
 *     tags: [Alineaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_alineacion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alineación.
 *     responses:
 *       200:
 *         description: Información de la alineación.
 *       404:
 *         description: Alineación no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id_alineacion", obtenerAlineacion);

/**
 * @swagger
 * /api/alineaciones/activar/{id_alineacion}:
 *   put:
 *     summary: Activar una alineación
 *     description: Activa una alineación para que sea la utilizada por el equipo.
 *     tags: [Alineaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_alineacion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alineación.
 *     responses:
 *       200:
 *         description: Alineación activada correctamente.
 *       404:
 *         description: Alineación no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/activar/:id_alineacion", activarAlineacion);

/**
 * @swagger
 * /api/alineaciones/{id_alineacion}:
 *   delete:
 *     summary: Eliminar una alineación
 *     description: Elimina una alineación por su ID.
 *     tags: [Alineaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_alineacion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alineación.
 *     responses:
 *       200:
 *         description: Alineación eliminada correctamente.
 *       404:
 *         description: Alineación no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id_alineacion", eliminarAlineacion);

export default router;
