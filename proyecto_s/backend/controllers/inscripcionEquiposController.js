import {
  obtenerInscripcionesService,
  obtenerInscripcionPorIdService,
  obtenerInscripcionesPorTorneoService,
  obtenerInscripcionesPorEquipoService,
  crearInscripcionService,
  actualizarEstadoInscripcionService,
  desactivarInscripcionService,
} from "../services/inscripcionEquiposService.js";

// ========================================
// OBTENER TODAS LAS INSCRIPCIONES
// ========================================
export const obtenerInscripciones = async (req, res) => {
  try {
    const data = await obtenerInscripcionesService();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// OBTENER INSCRIPCIÓN POR ID
// ========================================
export const obtenerInscripcionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await obtenerInscripcionPorIdService(id);

    if (!data) {
      return res.status(404).json({
        message: "Inscripción no encontrada.",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// OBTENER INSCRIPCIONES POR TORNEO
// ========================================
export const obtenerInscripcionesPorTorneo = async (req, res) => {
  try {
    const { id_torneo } = req.params;

    const data = await obtenerInscripcionesPorTorneoService(id_torneo);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// OBTENER INSCRIPCIONES POR EQUIPO
// ========================================
export const obtenerInscripcionesPorEquipo = async (req, res) => {
  try {
    const { id_equipo } = req.params;

    const data = await obtenerInscripcionesPorEquipoService(id_equipo);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// CREAR INSCRIPCIÓN
// ========================================
export const crearInscripcion = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const data = await crearInscripcionService(
      id_usuario,
      req.body
    );

    res.status(201).json(data);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ========================================
// ACTUALIZAR ESTADO
// RN-004: Solo el organizador del torneo
// puede aprobar o cancelar una inscripción.
// ========================================
export const actualizarEstadoInscripcion = async (req, res) => {
  try {

    const { id } = req.params;
    const { estado } = req.body;
    const id_usuario = req.user.id_usuario;

    const data = await actualizarEstadoInscripcionService(
      id,
      estado,
      id_usuario
    );

    res.json(data);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ========================================
// ELIMINAR INSCRIPCIÓN
// ========================================
export const eliminarInscripcion = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await desactivarInscripcionService(id);

    res.json(data);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};