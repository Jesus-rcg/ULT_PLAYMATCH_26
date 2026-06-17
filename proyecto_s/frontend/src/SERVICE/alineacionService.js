import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Guardar una alineación
export const guardarAlineacionRequest = async (data) => {
  const { data: response } = await axios.post(`${API}/alineaciones`, data);

  return response;
};

// Obtener las alineaciones de un equipo
export const getAlineacionesEquipoRequest = async (id_equipo) => {
  const { data } = await axios.get(`${API}/alineaciones/equipo/${id_equipo}`);

  return data;
};

// Obtener una alineación por su id
export const getAlineacionRequest = async (id_alineacion) => {
  const { data } = await axios.get(`${API}/alineaciones/${id_alineacion}`);

  return data;
};

// Activar una alineación
export const activarAlineacionRequest = async (id_alineacion) => {
  const { data } = await axios.put(
    `${API}/alineaciones/activar/${id_alineacion}`,
  );

  return data;
};

// Eliminar una alineación
export const eliminarAlineacionRequest = async (id_alineacion) => {
  const { data } = await axios.delete(`${API}/alineaciones/${id_alineacion}`);

  return data;
};
