import { Router } from "express";

import {
createJugador,
getJugadores,
getJugadorById,
updateJugador,
deleteJugador
  
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
router.get("/:id", getJugadorById);

/**
* @swagger
* /api/jugadores/usuarios-disponibles:
*   get:
*     summary: Obtener usuarios disponibles para registrar como jugadores
*     description: Devuelve los usuarios que aún no están registrados como jugadores.
*     tags: [Jugadores]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Lista de usuarios disponibles.
*       500:
*         description: Error interno del servidor.
*/


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
router.post("/", createJugador);

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