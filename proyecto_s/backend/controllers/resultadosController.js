import pool from "../config/db.js";

import {
  getResultadosService,
  getResultadoByIdService,
  getResultadoByEncuentroService,
  createResultadoService,
  updateResultadoService,
  deleteResultadoService,
  sumarGolResultadoService,
} from "../SERVICES/resultadosService.js";

// Obtener todos
export const getResultados = async (req, res) => {
  try {
    const data = await getResultadosService();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener resultados",
    });
  }
};

// Obtener por ID
export const getResultadoById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getResultadoByIdService(id);

    if (!data) {
      return res.status(404).json({
        message: "Resultado no encontrado",
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener resultado",
    });
  }
};

// Crear
export const createResultado = async (req, res) => {
  try {
    const result = await createResultadoService(req.body);

    res.status(201).json({
      message: "Resultado creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear resultado",
    });
  }
};

// Actualizar
export const updateResultado = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await updateResultadoService(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Resultado no encontrado",
      });
    }

    res.json({
      message: "Resultado actualizado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar resultado",
    });
  }
};

// Eliminar
export const deleteResultado = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteResultadoService(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Resultado no encontrado",
      });
    }

    res.json({
      message: "Resultado eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar resultado",
    });
  }
};

export const getResultadoByEncuentro = async (req, res) => {
  try {
    const { id } = req.params;

    let resultado = await getResultadoByEncuentroService(id);

    if (!resultado) {
      const nuevo = await createResultadoService({
        id_encuentro: id,
        goles_local: 0,
        goles_visitante: 0,
      });

      resultado = {
        id_resultado: nuevo.insertId,
        id_encuentro: Number(id),
        goles_local: 0,
        goles_visitante: 0,
      };
    }

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error del servidor",
    });
  }
};

export const sumarGolResultado = async (req, res) => {
  try {
    const { idEncuentro, equipo } = req.body;

    await sumarGolResultadoService(idEncuentro, equipo);

    res.json({ message: "Marcador actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando marcador" });
  }
};

export const updateResultadoPorEncuentro = async (req, res) => {
  try {
    const { id } = req.params;
    const { goles_local, goles_visitante } = req.body;

    const [result] = await pool.query(
      `
      UPDATE resultados
      SET goles_local = ?, goles_visitante = ?
      WHERE id_encuentro = ?
      `,
      [goles_local, goles_visitante, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Resultado no encontrado",
      });
    }

    res.json({
      message: "Resultado actualizado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar resultado",
    });
  }
};
