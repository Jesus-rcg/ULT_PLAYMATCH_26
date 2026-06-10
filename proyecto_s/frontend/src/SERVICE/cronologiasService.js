const API = import.meta.env.VITE_API_URL + "/cronologias";
const API_BASE = import.meta.env.VITE_API_URL;

// Obtener todas
export const getCronologias = async () => {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Error al obtener cronologías");
  }

  return await response.json();
};

// Obtener por ID
export const getCronologiaById = async (id) => {
  const response = await fetch(`${API}/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener cronología");
  }

  return await response.json();
};

// Crear
export const createCronologia = async (cronologia) => {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cronologia),
  });

  if (!response.ok) {
    throw new Error("Error al crear cronología");
  }

  return await response.json();
};

// Actualizar
export const updateCronologia = async (id, cronologia) => {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cronologia),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar cronología");
  }

  return await response.json();
};

// Eliminar
export const deleteCronologia = async (id) => {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar cronología");
  }

  return await response.json();
};

// Jugadores por encuentro
export const getJugadoresByEncuentro = async (id_encuentro) => {
  const response = await fetch(
    `${API_BASE}/cronologias/encuentro/${id_encuentro}/jugadores`,
  );

  if (!response.ok) {
    throw new Error("Error al obtener jugadores del encuentro");
  }

  return await response.json();
};

// DETALLE DEL ENCUENTRO
export const getEncuentroDetalle = async (id) => {
  const response = await fetch(`${API_BASE}/encuentros/detalle/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener detalle del encuentro");
  }

  return await response.json();
};

export const getJugadoresByEquipo = async (id_equipo) => {
  const response = await fetch(
    `${API_BASE}/inscripcionJugadores/equipo/${id_equipo}`,
  );

  if (!response.ok) {
    throw new Error("Error al obtener jugadores");
  }

  return await response.json();
};
