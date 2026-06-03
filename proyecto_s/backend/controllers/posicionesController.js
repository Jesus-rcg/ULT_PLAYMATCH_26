import { getTablaPosicionesService } from "../services/posicionesService.js";

export const getTablaPosicionesController = async (req, res) => {
  try {
    const { id_torneo } = req.params;

    const posiciones = await getTablaPosicionesService(id_torneo);

    res.status(200).json({
      ok: true,
      message: "Tabla de posiciones obtenida correctamente",
      data: posiciones,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error al obtener tabla de posiciones",
    });
  }
};
