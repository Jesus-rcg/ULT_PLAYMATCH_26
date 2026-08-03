/**
 * ==========================================================
 * SERVICE: EQUIPOS
  Cada función llama a un endpoint
 * específico del backend usando axios.
 *
 * Se usa la instancia "api" (definida en api.js) porque ya
 * trae configurado el interceptor que agrega el token
 * automáticamente en cada petición protegida.
 * ==========================================================
 */

import api from "./api.js";

/**
 * Obtener todos los equipos activos.
 * Endpoint: GET /equipos
 * No requiere autenticación (según las rutas del backend).
 */
export const getEquipos = async () => {
  const { data } = await api.get("/equipos");
  return data;
};

/**
 * Obtener los equipos que pertenecen al usuario (DT) autenticado.
 * Endpoint: GET /equipos/usuario/mios
 * Requiere token (el DT debe estar logueado).
 */
export const getMisEquipos = async () => {
  const { data } = await api.get("/equipos/usuario/mios");
  return data;
};

/**
 * Obtener el detalle de un equipo por su ID.
 * Endpoint: GET /equipos/:id
 */
export const getEquipoById = async (id) => {
  const { data } = await api.get(`/equipos/${id}`);
  return data;
};

/**
 * Registrar un nuevo equipo.
 * Endpoint: POST /equipos
 * Requiere token. El backend toma el id_usuario del token,
 * así que aquí solo mandamos nombre_equipo y escudo.
 *
 * @param {Object} equipo - { nombre_equipo, escudo (base64) }
 */
export const createEquipo = async (equipo) => {
  const { data } = await api.post("/equipos", equipo);
  return data;
};

/**
 * Actualizar un equipo existente.
 * Endpoint: PUT /equipos/:id
 * Requiere token.
 *
 * @param {number|string} id
 * @param {Object} equipo - { nombre_equipo, escudo (base64) }
 */
export const updateEquipo = async (id, equipo) => {
  const { data } = await api.put(`/equipos/${id}`, equipo);
  return data;
};

/**
 * Desactivar un equipo (eliminación lógica, activo = 0).
 * Endpoint: DELETE /equipos/:id
 * Requiere token.
 */
export const deleteEquipo = async (id) => {
  const { data } = await api.delete(`/equipos/${id}`);
  return data;
};