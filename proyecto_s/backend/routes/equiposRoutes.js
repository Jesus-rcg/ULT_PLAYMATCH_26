import express from "express";

import {
  obtenerEquipos,
  obtenerEquiposPorUsuario,
  obtenerEquipoPorId,
  crearEquipo,
  actualizarEquipo,
  desactivarEquipo,
} from "../controllers/equiposController.js";

import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

/**
 * ==========================================================
 * RUTAS DEL MÓDULO EQUIPOS
 * PROYECTO: PLAYMATCH
 * ==========================================================
 */

/**
 * Obtener todos los equipos activos
 */
router.get("/", obtenerEquipos);

/**
 * Obtener los equipos del usuario autenticado
 */
router.get("/usuario/mios", verificarToken, obtenerEquiposPorUsuario);

/**
 * Obtener un equipo por ID
 */
router.get("/:id", obtenerEquipoPorId);

/**
 * Registrar un nuevo equipo
 */
router.post("/", verificarToken, crearEquipo);

/**
 * Actualizar un equipo
 */
router.put("/:id", verificarToken, actualizarEquipo);

/**
 * Desactivar un equipo (eliminación lógica)
 */
router.delete("/:id", verificarToken, desactivarEquipo);

export default router;