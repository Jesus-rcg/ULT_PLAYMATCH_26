const API = import.meta.env.VITE_API_URL + "/jugadores";

export const getJugadores = async () => {
  const res = await fetch(API);
  return await res.json();
};

export const getJugadorById = async (id) => {
  const res = await fetch(`${API}/${id}`);
  return await res.json();
};

export const createJugador = async (jugador) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jugador),
  });

  return await res.json();
};

export const updateJugador = async (id, jugador) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jugador),
  });

  return await res.json();
};

export const deleteJugador = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  return await res.json();
};
