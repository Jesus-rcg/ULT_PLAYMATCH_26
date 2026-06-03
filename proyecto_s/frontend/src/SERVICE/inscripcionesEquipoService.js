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
export const getInscripciones = async () => {
  const res = await api.get("/inscripcionEquipos");
  return res.data;
};

// 🔹 GET POR ID
export const getInscripcionById = async (id) => {
  const res = await api.get(`/inscripcionEquipos/${id}`);
  return res.data;
};

// 🔥 CREATE
export const createInscripcion = async (data) => {
  const res = await api.post("/inscripcionEquipos", data);
  return res.data;
};

// 🔥 UPDATE
export const updateInscripcion = async (id, data) => {
  const res = await api.put(`/inscripcionEquipos/${id}`, data);
  return res.data;
};

// 🔥 DELETE
export const deleteInscripcion = async (id) => {
  const res = await api.delete(`/inscripcionEquipos/${id}`);
  return res.data;
};
