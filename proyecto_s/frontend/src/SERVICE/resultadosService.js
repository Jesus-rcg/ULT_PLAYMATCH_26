const API = import.meta.env.VITE_API_URL + "/resultados";

// Obtener todos
export const getResultados = async () => {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Error al obtener resultados");
  }

  return await response.json();
};

// Obtener por ID
export const getResultadoById = async (id) => {
  const response = await fetch(`${API}/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener resultado");
  }

  return await response.json();
};

// Crear
export const createResultado = async (resultado) => {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resultado),
  });

  if (!response.ok) {
    throw new Error("Error al crear resultado");
  }

  return await response.json();
};

// Actualizar
export const updateResultado = async (id, resultado) => {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resultado),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar resultado");
  }

  return await response.json();
};

// Eliminar
export const deleteResultado = async (id) => {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar resultado");
  }

  return await response.json();
};
