import express from "express";
import {
  getTorneos,
  getTorneoById,
  createTorneo,
  updateTorneo,
  deleteTorneo,
  getTorneosByUsuario,
  getTipoTorneoController,
  getCategoriaController 
} from "../controllers/torneoController.js";

import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

<<<<<<< Updated upstream
/**
 * @swagger
 * tags:
 *   name: Torneos
 *   description: Gestión de torneos
 */

/**
 * @swagger
 * /api/torneos/usuario/mios:
 *   get:
 *     summary: Obtener los torneos creados por el usuario autenticado
 *     description: Devuelve todos los torneos creados por el usuario identificado mediante el token JWT.
 *     tags: [Torneos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de torneos del usuario.
 *       401:
 *         description: Token inválido o no enviado.
 *       500:
 *         description: Error interno del servidor.
 */

// Tipo Torneos
router.get("/tipo-torneo", getTipoTorneoController);

// Categoria Torneo

router.get("/categoria", getCategoriaController);

// 🔥 PRIMERO rutas específicas

router.get("/usuario/mios", verificarToken, getTorneosByUsuario);

/**
 * @swagger
 * /api/torneos:
 *   get:
 *     summary: Obtener todos los torneos
 *     description: Devuelve la lista de todos los torneos registrados.
 *     tags: [Torneos]
 *     responses:
 *       200:
 *         description: Lista de torneos.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getTorneos);

<<<<<<< Updated upstream
/**
 * @swagger
 * /api/torneos/{id}:
 *   get:
 *     summary: Obtener un torneo por ID
 *     description: Devuelve la información de un torneo específico.
 *     tags: [Torneos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del torneo.
 *     responses:
 *       200:
 *         description: Torneo encontrado.
 *       404:
 *         description: Torneo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", getTorneoById);

/**
 * @swagger
 * /api/torneos:
 *   post:
 *     summary: Crear un torneo
 *     description: Crea un nuevo torneo.
 *     tags: [Torneos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Torneo'
 *     responses:
 *       201:
 *         description: Torneo creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error interno del servidor.
 */
=======

// DESPUÉS rutas dinámicas
router.get("/:id", getTorneoById);



// CREAR
>>>>>>> Stashed changes
router.post("/", verificarToken, createTorneo);

/**
 * @swagger
 * /api/torneos/{id}:
 *   put:
 *     summary: Actualizar un torneo
 *     description: Actualiza la información de un torneo existente.
 *     tags: [Torneos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del torneo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Torneo'
 *     responses:
 *       200:
 *         description: Torneo actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Torneo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id", verificarToken, updateTorneo);

/**
 * @swagger
 * /api/torneos/{id}:
 *   delete:
 *     summary: Eliminar un torneo
 *     description: Elimina un torneo mediante su ID.
 *     tags: [Torneos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del torneo.
 *     responses:
 *       200:
 *         description: Torneo eliminado correctamente.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Torneo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", verificarToken, deleteTorneo);

export default router;
