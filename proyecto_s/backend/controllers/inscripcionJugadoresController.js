import * as InscripcionJugadorService from "../services/inscripcionJugadoresService.js";

//Obtener  todas
export const getInscripcionesJugadores = async (req, res) => {
  try {
    const data = await InscripcionJugadorService.getInscripcionesJugadores();

    res.json(data);
  } catch (error) {
    console.error(" ERROR REAL:", error.sqlMessage || error.message || error);

    res.status(500).json({
      message:
        error.sqlMessage || error.message || "Error al obtener inscripciones",
    });
  }
};

//Obtener por equipo
export const getByEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ID de equipo requerido",
      });
    }

    const data = await InscripcionJugadorService.getInscripcionesByEquipo(id);

    res.json(data);
  } catch (error) {
    console.error(" ERROR REAL:", error.sqlMessage || error.message || error);

    res.status(500).json({
      message: error.sqlMessage || "Error al obtener por equipo",
    });
  }
};

//Obtener por ID
export const getInscripcionJugadorById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await InscripcionJugadorService.getInscripcionJugadorById(id);

    if (!data) {
      return res.status(404).json({
        message: "Inscripción no encontrada",
      });
    }

    res.json(data);
  } catch (error) {
    console.error(" ERROR REAL:", error.sqlMessage || error.message || error);

    res.status(500).json({
      message: error.sqlMessage || "Error al obtener inscripción",
    });
  }
};

//Crear inscripcion
export const createInscripcionJugador = async (req, res) => {
  try {
    const { id_equipo, id_jugador, estado } = req.body;

    const result = await InscripcionJugadorService.crearInscripcionJugador(
      id_equipo,
      id_jugador,
      estado,
    );

    res.status(201).json({
      message: "Inscripción creada",
      id: result.insertId,
    });
  } catch (error) {
    console.error(" ERROR REAL:", error.sqlMessage || error.message || error);

    res.status(500).json({
      message: error.message || "Error al crear inscripción",
    });
  }
};

//Actualizar estado
export const updateEstadoJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!id || !estado) {
      return res.status(400).json({
        message: "Datos incompletos",
      });
    }

    const result = await InscripcionJugadorService.cambiarEstadoJugador(
      id,
      estado,
    );

    res.json({
      message: "Estado actualizado",
      result,
    });
  } catch (error) {
    console.error(" ERROR REAL:", error.sqlMessage || error.message || error);

    res.status(500).json({
      message: error.message || "Error al actualizar estado",
    });
  }
};

//Eliminar
export const deleteInscripcionJugador = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ID requerido",
      });
    }

    await InscripcionJugadorService.eliminarInscripcionJugador(id);

    res.json({
      message: "Inscripción eliminada",
    });
  } catch (error) {
    console.error(" ERROR REAL:", error.sqlMessage || error.message || error);

    res.status(500).json({
      message: error.message || "Error al eliminar inscripción",
    });
  }
};
