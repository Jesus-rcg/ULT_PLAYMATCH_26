/**
 * ==========================================================
 * MÓDULO: EQUIPOS
 *
 * Controlador encargado de recibir las peticiones HTTP
 * relacionadas con los equipos.
 * ==========================================================
 */

import {
  obtenerEquiposService,
  obtenerEquiposPorUsuarioService,
  obtenerEquipoPorIdService,
  crearEquipoService,
  actualizarEquipoService,
  desactivarEquipoService,
} from "../services/equiposService.js";

/**
 * ==========================================================
 * Obtener todos los equipos
 * ==========================================================
 */
export const obtenerEquipos = async (req, res) => {
  try {

    const equipos = await obtenerEquiposService();

    return res.json(equipos);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

/**
 * ==========================================================
 * Obtener equipos del usuario autenticado
 * ==========================================================
 */
export const obtenerEquiposPorUsuario = async (req, res) => {

  try {

    const id_usuario = req.user?.id_usuario;

    const equipos = await obtenerEquiposPorUsuarioService(id_usuario);

    return res.json(equipos);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};

/**
 * ==========================================================
 * Obtener equipo por ID
 * ==========================================================
 */
export const obtenerEquipoPorId = async (req, res) => {

  try {

    const { id } = req.params;

    const equipo = await obtenerEquipoPorIdService(id);

    return res.json(equipo);

  } catch (error) {

    return res.status(404).json({
      message: error.message,
    });

  }

};

/**
 * ==========================================================
 * Registrar equipo
 * ==========================================================
 */
export const crearEquipo = async (req, res) => {

  try {

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "No autenticado",
      });
    }

    const data = {

      id_usuario: user.id_usuario,

      nombre_equipo: req.body.nombre_equipo,

      escudo: req.body.escudo,

    };

    const equipo = await crearEquipoService(data);

    return res.status(201).json({

      message: "Equipo registrado correctamente.",

      equipo,

    });

  } catch (error) {

    return res.status(400).json({

      message: error.message,

    });

  }

};

/**
 * ==========================================================
 * Actualizar equipo
 * ==========================================================
 */
export const actualizarEquipo = async (req, res) => {

  try {

    const { id } = req.params;

    const equipo = await actualizarEquipoService(

      id,

      req.body

    );

    return res.json(equipo);

  } catch (error) {

    return res.status(400).json({

      message: error.message,

    });

  }

};

/**
 * ==========================================================
 * Desactivar equipo
 * ==========================================================
 */
export const desactivarEquipo = async (req, res) => {

  try {

    const { id } = req.params;

    const equipo = await desactivarEquipoService(id);

    return res.json(equipo);

  } catch (error) {

    return res.status(400).json({

      message: error.message,

    });

  }

};