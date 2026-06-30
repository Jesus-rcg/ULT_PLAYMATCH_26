import * as InscripcionService from "../services/inscripcionEquiposService.js";

//Obtenero todas
export const getInscripciones = async (req, res) => {
  try {
    const data = await InscripcionService.getInscripciones();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener inscripciones" });
  }
};

//Obtener por torneo
export const getByTorneo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID de torneo requerido" });
    }

    const data = await InscripcionService.getInscripcionesByTorneo(id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener por torneo" });
  }
};

//Obtener por ID
export const getInscripcionById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await InscripcionService.getInscripcionById(id);

    if (!data) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener inscripción" });
  }
};

//Crear inscripcion
export const createInscripcion = async (req, res) => {
  try {
    const { id_torneo, id_equipo, estado } = req.body;

    const result = await InscripcionService.crearInscripcion(
      id_torneo,
      id_equipo,
      estado,
    );

    res.status(201).json({
      message: "Inscripción creada",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Actualizar estado de equipo
export const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!id || !estado) {
      return res.status(400).json({
        message: "Datos incompletos",
      });
    }

    const result = await InscripcionService.cambiarEstado(id, estado);

    res.json({
      message: "Estado actualizado",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Error al actualizar estado",
    });
  }
};

//ELiminar
export const deleteInscripcion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID requerido" });
    }

    await InscripcionService.eliminarInscripcion(id);

    res.json({ message: "Inscripción eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar inscripción" });
  }
};
