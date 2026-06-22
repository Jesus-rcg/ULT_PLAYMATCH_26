const API = import.meta.env.VITE_API_URL + "/equipos";

export const getEquipos = async () => {
  const res = await fetch(API);
  return await res.json();
};

export const getEquipoById = async (id) => {
  const res = await fetch(`${API}/${id}`);
  return await res.json();
};

export const createEquipo = async (equipo) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipo),
  });

  return await res.json();
};

export const updateEquipo = async (id, equipo) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipo),
  });

  return await res.json();
};

export const deleteEquipo = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  return await res.json();
};

// 🔥 NUEVO: equipos inscritos en torneo
export const getEquiposByTorneo = async (idTorneo) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/equipos/torneo/${idTorneo}`,
  );

  return await res.json();
};
