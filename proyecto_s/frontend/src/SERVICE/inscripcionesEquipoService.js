import axios from "axios";

const API = import.meta.env.VITE_API_URL;

//  instancia con interceptor (token automático)
const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 GET TODAS
export const getInscripciones = async () => {
  const res = await api.get("/inscripcionEquipos");
  return res.data;
};

// 🔹 GET POR ID
export const getInscripcionById = async (id) => {
  const res = await api.get(`/inscripcionEquipos/${id}`);
  return res.data;
};
// 🔹 GET POR TORNEO (para la vista del organizador)
export const getInscripcionesPorTorneo = async (idTorneo) => {
  const res = await api.get(`/inscripcionEquipos/torneo/${idTorneo}`);
  return res.data;
};

// 🔹 GET POR EQUIPO (para la vista del DT)
export const getInscripcionesPorEquipo = async (idEquipo) => {
  const res = await api.get(`/inscripcionEquipos/equipo/${idEquipo}`);
  return res.data;
};

//  crear 
export const createInscripcion = async (data) => {
  const res = await api.post("/inscripcionEquipos", data);
  return res.data;
};

//  UPDATE ESTADO
export const updateInscripcion = async (id, data) => {
  const res = await api.put(`/inscripcionEquipos/${id}/estado`, data);
  return res.data;
};

//  eliminar 
export const deleteInscripcion = async (id) => {
  const res = await api.delete(`/inscripcionEquipos/${id}`);
  return res.data;
};