const API = import.meta.env.VITE_API_URL + "/encuentros";

// OBTENER TODOS
export const getEncuentros = async () => {
  const res = await fetch(API);

  return await res.json();
};

// OBTENER POR ID
export const getEncuentroById = async (id) => {
  const res = await fetch(`${API}/${id}`);

  return await res.json();
};

// OBTENER ENCUENTROS POR TORNEO
export const getEncuentrosByTorneo = async (id_torneo) => {
  const res = await fetch(`${API}/torneo/${id_torneo}`);

  return await res.json();
};

// CREAR
export const createEncuentro = async (encuentro) => {
  const res = await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(encuentro),
  });

  return await res.json();
};

// ACTUALIZAR
export const updateEncuentro = async (id, encuentro) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(encuentro),
  });

  return await res.json();
};

// ELIMINAR
export const deleteEncuentro = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  return await res.json();
};

// GENERAR FIXTURE AUTOMÁTICO
export const generarFixtureAutomatico = async (datos) => {
  const res = await fetch(`${API}/generar-fixture`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(datos),
  });

  return await res.json();
};
