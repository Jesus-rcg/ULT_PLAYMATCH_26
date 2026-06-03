import {
  getCronologiasService,
  getCronologiaByIdService,
  createCronologiaService,
  updateCronologiaService,
  deleteCronologiaService,
  getJugadoresByEncuentroService,
} from "../SERVICES/cronologiasService.js";

// Obtener todas
export const getCronologias = async (req, res) => {
  try {
    const data = await getCronologiasService();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener cronologías",
    });
  }
};

// Obtener por ID
export const getCronologiaById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getCronologiaByIdService(id);

    if (!data) {
      return res.status(404).json({
        message: "Cronología no encontrada",
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener cronología",
    });
  }
};

// Crear
export const createCronologia = async (req, res) => {
  try {
    const result = await createCronologiaService(req.body);

    res.status(201).json({
      message: "Cronología creada correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear cronología",
    });
  }
};

// Actualizar
export const updateCronologia = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await updateCronologiaService(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Cronología no encontrada",
      });
    }

    res.json({
      message: "Cronología actualizada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar cronología",
    });
  }
};

// Eliminar
export const deleteCronologia = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteCronologiaService(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Cronología no encontrada",
      });
    }

    res.json({
      message: "Cronología eliminada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar cronología",
    });
  }
};

//Obtener  jugador por encuentro
export const getJugadoresByEncuentro = async (req, res) => {
  try {
    const { id_encuentro } = req.params;

    const data = await getJugadoresByEncuentroService(id_encuentro);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener jugadores del encuentro",
    });
  }
};
