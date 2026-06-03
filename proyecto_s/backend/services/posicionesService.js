import { getTablaPosicionesModel } from "../models/posicionesModel.js";

export const getTablaPosicionesService = async (id_torneo) => {
  if (!id_torneo) {
    throw new Error("id_torneo es requerido");
  }

  const data = await getTablaPosicionesModel(id_torneo);

  return data;
};
