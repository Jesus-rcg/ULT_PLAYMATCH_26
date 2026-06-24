import {
  getJugadoresService,
  getJugadorByIdService,
  createJugadorService,
  updateJugadorService,
  deleteJugadorService,
} from "../services/jugadoresService.js";

// Obtener todos los jugadores
export const getJugadores = async (req, res) => {
  try {
    const jugadores = await getJugadoresService();

    res.json(jugadores);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Error al obtener jugadores",
    });
  }
};

// Obtener jugador por ID
export const getJugadorById = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await getJugadorByIdService(id);

    if (!jugador) {
      return res.status(404).json({
        msg: "Jugador no encontrado",
      });
    }

    res.json(jugador);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Error al obtener jugador",
    });
  }
};

// Crear jugador
export const createJugador = async (req, res) => {
  try {
    const result = await createJugadorService(req.body);

    res.status(201).json({
      msg: "Jugador creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Error al crear jugador",
    });
  }
};

// Actualizar jugador
export const updateJugador = async (req, res) => {
  try {

    const { id } = req.params;

    console.log("ID:", id);
    console.log("BODY:", req.body);

    const result = await updateJugadorService(id, req.body);

    console.log("RESULT:", result);

    res.json({
      msg: "Jugador actualizado correctamente",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Error al actualizar jugador",
    });
  }
};

// Eliminar jugador
export const deleteJugador = async (req, res) => {
  try {

    const { id } = req.params;

    console.log("ID recibido:", id);

    const result = await deleteJugadorService(id);

    console.log("Resultado:", result);

    res.json({
      msg: "Jugador eliminado correctamente",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Error al eliminar jugador",
    });
  }
};
