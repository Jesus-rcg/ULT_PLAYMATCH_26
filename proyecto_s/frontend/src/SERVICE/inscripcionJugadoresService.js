import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// 🔥 instancia con interceptor (token automático)
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
export const getInscripcionesJugadores = async () => {
  const res = await api.get("/inscripcionJugadores");
  return res.data;
};

// 🔹 GET POR ID
export const getInscripcionJugadorById = async (id) => {
  const res = await api.get(`/inscripcionJugadores/${id}`);
  return res.data;
};

// 🔹 GET POR EQUIPO
export const getInscripcionesByEquipo = async (id) => {
  const res = await api.get(`/inscripcionJugadores/equipo/${id}`);
  return res.data;
};

// 🔥 CREATE
export const createInscripcionJugador = async (data) => {
  const res = await api.post("/inscripcionJugadores", data);
  return res.data;
};

// 🔥 UPDATE
export const updateInscripcionJugador = async (id, data) => {
  const res = await api.put(`/inscripcionJugadores/${id}`, data);
  return res.data;
};

// 🔥 DELETE
export const deleteInscripcionJugador = async (id) => {
  const res = await api.delete(`/inscripcionJugadores/${id}`);
  return res.data;
};
