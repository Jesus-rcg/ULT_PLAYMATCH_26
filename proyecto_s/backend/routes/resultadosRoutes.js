import { Router } from "express";

import {
  getResultados,
  getResultadoById,
  getResultadoByEncuentro,
  createResultado,
  updateResultado,
  updateResultadoPorEncuentro,
  deleteResultado,
} from "../CONTROLLERS/resultadosController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Resultados
 *   description: Gestión de resultados de los encuentros
 */

/**
 * @swagger
 * /api/resultados/encuentro/{id}:
 *   get:
 *     summary: Obtener el resultado de un encuentro
 *     description: Devuelve el resultado asociado a un encuentro.
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del encuentro.
 *     responses:
 *       200:
 *         description: Resultado encontrado.
 *       404:
 *         description: Resultado no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/encuentro/:id", getResultadoByEncuentro);

/**
 * @swagger
 * /api/resultados/encuentro/{id}:
 *   put:
 *     summary: Actualizar resultado por encuentro
 *     description: Actualiza el resultado utilizando el ID del encuentro.
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del encuentro.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resultado'
 *     responses:
 *       200:
 *         description: Resultado actualizado correctamente.
 *       404:
 *         description: Encuentro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/encuentro/:id", updateResultadoPorEncuentro);

/**
 * @swagger
 * /api/resultados:
 *   get:
 *     summary: Obtener todos los resultados
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de resultados.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getResultados);

/**
 * @swagger
 * /api/resultados/{id}:
 *   get:
 *     summary: Obtener un resultado por ID
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del resultado.
 *     responses:
 *       200:
 *         description: Resultado encontrado.
 *       404:
 *         description: Resultado no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", getResultadoById);

/**
 * @swagger
 * /api/resultados:
 *   post:
 *     summary: Crear un resultado
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resultado'
 *     responses:
 *       201:
 *         description: Resultado creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", createResultado);

/**
 * @swagger
 * /api/resultados/{id}:
 *   put:
 *     summary: Actualizar un resultado
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del resultado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resultado'
 *     responses:
 *       200:
 *         description: Resultado actualizado correctamente.
 *       404:
 *         description: Resultado no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id", updateResultado);

/**
 * @swagger
 * /api/resultados/{id}:
 *   delete:
 *     summary: Eliminar un resultado
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del resultado.
 *     responses:
 *       200:
 *         description: Resultado eliminado correctamente.
 *       404:
 *         description: Resultado no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", deleteResultado);

export default router;
