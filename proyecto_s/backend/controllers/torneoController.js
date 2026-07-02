import {
  getTorneosService,
  createTorneoService,
  deleteTorneoService,
  getTorneoByIdService,
  updateTorneoService,
  getTorneosByUsuarioService,
} from "../services/torneoService.js";

import {getTipoTorneoService,} from "../services/torneoService.js";
import {getCategoriaService,} from "../services/torneoService.js";


// Obtener todos los torneos
export const getTorneos = async (req, res) => {
  try {
    const torneos = await getTorneosService();
    res.json(torneos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getTipoTorneoController = async (req, res) => {
  try {
    const data = await getTipoTorneoService();
    return res.json(data);
  } catch (error) {
  console.error(error);

  return res.status(500).json({
    message: error.message,
    error,
  });
}
};

export const getCategoriaController = async (req, res) => {
  try {
    const data = await getCategoriaService();
    return res.json(data);
  } catch (error) {
  console.error(error);

  return res.status(500).json({
    message: error.message,
    error,
  });
}
};

export const getTorneosByUsuario = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;

    const data = await getTorneosByUsuarioService(id_usuario);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener torneos del usuario",
    });
  }
};

// Obtener torneo por ID
export const getTorneoById = async (req, res) => {
  try {
    const { id } = req.params;

    const torneo = await getTorneoByIdService(id);

    if (!torneo) {
      return res.status(404).json({
        message: "Torneo no encontrado",
      });
    }

    res.json(torneo);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Crear torneo
export const createTorneo = async (req, res) => {
  console.log("📩 BODY RECIBIDO:", req.body);
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "No autenticado",
      });
    }

    const id_usuario = Number(user.id_usuario);

    if (!id_usuario || Number.isNaN(id_usuario)) {
      return res.status(403).json({
        message: "Usuario inválido en token",
      });
    }

    const {
      nombre_torneo,
      categoria,
      tipo_torneo,
      ciudad,
      fecha_inicio,
      fecha_fin,
    } = req.body;

    const data = {
      nombre_torneo,
      categoria,
      tipo_torneo,
      ciudad,
      fecha_inicio,
      fecha_fin,
      id_usuario,
    };

    const torneo = await createTorneoService(data);

    return res.status(201).json({
      message: "Torneo creado correctamente",
      torneo,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Actualizar torneo
export const updateTorneo = async (req, res) => {
  try {
    const { id } = req.params;

    const torneo = await getTorneoByIdService(id);

    if (!torneo) {
      return res.status(404).json({
        message: "Torneo no encontrado",
      });
    }

    const updated = await updateTorneoService(id, req.body);

    return res.json({
      message: "Torneo actualizado correctamente",
      updated,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Eliminar torneo
export const deleteTorneo = async (req, res) => {
  try {
    const { id } = req.params;

    const torneo = await getTorneoByIdService(id);

    if (!torneo) {
      return res.status(404).json({
        message: "Torneo no encontrado",
      });
    }

    await deleteTorneoService(id);

    return res.json({
      message: "Torneo eliminado correctamente",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
