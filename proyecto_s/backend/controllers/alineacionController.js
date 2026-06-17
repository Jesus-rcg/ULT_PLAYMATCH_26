import {
  guardarAlineacionService,
  obtenerAlineacionesService,
  obtenerAlineacionService,
  activarAlineacionService,
  eliminarAlineacionService,
} from "../services/alineacionService.js";

// Crear alineación
export const guardarAlineacion = async (req, res) => {
  try {
    await guardarAlineacionService(req.body);

    return res.status(201).json({
      success: true,
      message: "Alineación guardada correctamente",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const obtenerAlineaciones = async (req, res) => {
  try {
    const data = await obtenerAlineacionesService(req.params.id_equipo);

    res.json(data);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const obtenerAlineacion = async (req, res) => {
  try {
    const data = await obtenerAlineacionService(req.params.id_alineacion);

    res.json(data);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const activarAlineacion = async (req, res) => {
  try {
    const { id_equipo } = req.body;

    await activarAlineacionService(id_equipo, req.params.id_alineacion);

    res.json({
      success: true,
      message: "Alineación activada correctamente",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const eliminarAlineacion = async (req, res) => {
  try {
    await eliminarAlineacionService(req.params.id_alineacion);

    res.json({
      success: true,
      message: "Alineación eliminada correctamente",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
