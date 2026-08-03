/**
 * ==========================================================
 * SERVICIO: JUGADORES 
 * RF-003 Gestión de Jugadores
 * ==========================================================
 */

import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Instancia con interceptor (token automático)
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

// 🔹 GET TODOS los jugadores
export const getJugadores = async () => {
  const res = await api.get("/jugadores");
  return res.data;
};

// 🔹 GET jugador por ID
export const getJugadorById = async (id) => {
  const res = await api.get(`/jugadores/${id}`);
  return res.data;
};

// 🔹 GET jugadores de un equipo (para la pestaña "Jugadores")
export const getJugadoresPorEquipo = async (idEquipo) => {
  const res = await api.get(`/jugadores/equipo/${idEquipo}`);
  return res.data;
};

// CREAR jugador
export const createJugador = async (data) => {
  const res = await api.post("/jugadores", data);
  return res.data;
};

// ACTUALIZAR jugador
export const updateJugador = async (id, data) => {
  const res = await api.put(`/jugadores/${id}`, data);
  return res.data;
};

//  DESACTIVAR jugador borrado lógico
export const desactivarJugador = async (id, forzar = false) => {
  const url = forzar
    ? `/jugadores/${id}?forzar=true`
    : `/jugadores/${id}`;

  const res = await api.delete(url);
  return res.data;
};