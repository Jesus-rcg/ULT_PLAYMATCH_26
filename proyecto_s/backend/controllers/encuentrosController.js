import {
  getEncuentrosService,
  getEncuentroByIdService,
  createEncuentroService,
  updateEncuentroService,
  deleteEncuentroService,
  generarEncuentrosAutomaticosService,
  getEncuentrosByTorneoService, // ✅ ESTE ES EL CORRECTO
} from "../SERVICES/encuentrosService.js";

//Obtener todas
export const getEncuentros = async (req, res) => {
  try {
    const encuentros = await getEncuentrosService();

    res.json(encuentros);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener encuentros",
    });
  }
};

//Obtener por ID
export const getEncuentroById = async (req, res) => {
  try {
    const { id } = req.params;

    const encuentro = await getEncuentroByIdService(id);

    if (!encuentro) {
      return res.status(404).json({
        message: "Encuentro no encontrado",
      });
    }

    res.json(encuentro);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener encuentro",
    });
  }
};

export const getEncuentrosByTorneo = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getEncuentrosByTorneoService(id); // ✅ SERVICE

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener encuentros por torneo",
    });
  }
};

//Crear encuentro
export const createEncuentro = async (req, res) => {
  try {
    const result = await createEncuentroService(req.body);

    res.status(201).json({
      message: "Encuentro creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear encuentro",
    });
  }
};

//Actualizar encuentro
export const updateEncuentro = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await updateEncuentroService(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Encuentro no encontrado",
      });
    }

    res.json({
      message: "Encuentro actualizado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar encuentro",
    });
  }
};

//Eliminar
export const deleteEncuentro = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteEncuentroService(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Encuentro no encontrado",
      });
    }

    res.json({
      message: "Encuentro eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar encuentro",
    });
  }
};

//Generar encuentro auto
export const generarEncuentrosAutomaticos = async (req, res) => {
  try {
    const { id_torneo } = req.body;

    const result = await generarEncuentrosAutomaticosService(id_torneo);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
