import {
  getEquiposService,
  getEquipoByIdService,
  getEquipoByUsuarioService,
  getEquiposByTorneoService,
  createEquipoService,
  updateEquipoService,
  deleteEquipoService,
} from "../services/equiposService.js";

// Obtener todos los equipos
export const getEquipos = async (req, res) => {
  try {
    const equipos = await getEquiposService();
    res.json(equipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener equipos" });
  }
};

// Obtener equipo por ID
export const getEquipoById = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await getEquipoByIdService(id);

    if (!equipo) {
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }

    res.json(equipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener equipo" });
  }
};

// Crear equipo
export const createEquipo = async (req, res) => {
  try {
    const result = await createEquipoService(req.body);

    res.status(201).json({
      msg: "Equipo creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear equipo" });
  }
};

// Actualizar equipo
export const updateEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    await updateEquipoService(id, req.body);

    res.json({ msg: "Equipo actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar equipo" });
  }
};

// Eliminar equipo
export const deleteEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteEquipoService(id);

    res.json({ msg: "Equipo eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar equipo" });
  }
};

// 🔥 EQUIPOS POR TORNEO (CORREGIDO)
export const getEquiposByTorneo = async (req, res) => {
  try {
    const { id } = req.params;

    const equipos = await getEquiposByTorneoService(id);

    res.json(equipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener los equipos del torneo",
    });
  }
};

export const getEquipoByUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const equipo = await getEquipoByUsuarioService(id_usuario);

    if (!equipo) {
      return res.status(404).json({
        msg: "El usuario no tiene equipo",
      });
    }

    res.json(equipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al obtener equipo del usuario",
    });
  }
};
