import { Router } from "express";

import {
  getEquipos,
  getEquipoById,
  getEquipoJugadorByUsuario,
  getEquiposByTorneo,
  createEquipo,
  updateEquipo,
  deleteEquipo,
} from "../controllers/equiposController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Equipos
 *   description: Gestión de equipos
 */

/**
 * @swagger
 * /api/equipos/torneo/{id}:
 *   get:
 *     summary: Obtener equipos de un torneo
 *     tags: [Equipos]
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
 *         description: Lista de equipos del torneo.
 *       404:
 *         description: Torneo no encontrado.
 */
router.get("/torneo/:id", getEquiposByTorneo);

/**
 * @swagger
 * /api/equipos/jugador/usuario/{id_usuario}:
 *   get:
 *     summary: Obtener el equipo al que pertenece un usuario
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario.
 *     responses:
 *       200:
 *         description: Equipo encontrado.
 *       404:
 *         description: El usuario no pertenece a ningún equipo.
 */
router.get("/jugador/usuario/:id_usuario", getEquipoJugadorByUsuario);

/**
 * @swagger
 * /api/equipos:
 *   get:
 *     summary: Obtener todos los equipos
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos.
 */
router.get("/", getEquipos);

/**
 * @swagger
 * /api/equipos/{id}:
 *   get:
 *     summary: Obtener un equipo por ID
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipo encontrado.
 *       404:
 *         description: Equipo no encontrado.
 */
router.get("/:id", getEquipoById);

/**
 * @swagger
 * /api/equipos:
 *   post:
 *     summary: Crear un equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       201:
 *         description: Equipo creado correctamente.
 *       400:
 *         description: Datos inválidos.
 */
router.post("/", createEquipo);

/**
 * @swagger
 * /api/equipos/{id}:
 *   put:
 *     summary: Actualizar un equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo actualizado correctamente.
 *       404:
 *         description: Equipo no encontrado.
 */
router.put("/:id", updateEquipo);

/**
 * @swagger
 * /api/equipos/{id}:
 *   delete:
 *     summary: Eliminar un equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipo eliminado correctamente.
 *       404:
 *         description: Equipo no encontrado.
 */
router.delete("/:id", deleteEquipo);

export default router;
