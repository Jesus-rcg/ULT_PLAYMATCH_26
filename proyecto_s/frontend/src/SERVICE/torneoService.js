import api from "./api";

// 🔥 TODOS LOS TORNEOS
export const getTorneos = async () => {
  const res = await api.get("/torneos");
  return res.data;
};

// 🔥 TORNEOS DEL USUARIO LOGUEADO
export const getMisTorneos = async () => {
  const res = await api.get("/torneos/usuario/mios");
  return res.data;
};

// 🔥 POR ID
export const getTorneoById = async (id) => {
  const res = await api.get(`/torneos/${id}`);
  return res.data;
};

// 🔥 ENCUENTROS POR TORNEO (CORREGIDO)
export const getEncuentrosByTorneo = async (id_torneo) => {
  const res = await api.get(`/encuentros/torneo/${id_torneo}`);
  return res.data;
};

export const deleteTorneo = async (id_torneo) => {
  const res = await api.delete(`/torneos/${id_torneo}`);
  return res.data;
};
