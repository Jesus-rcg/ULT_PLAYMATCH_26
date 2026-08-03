/**
 * ==========================================================
 * CONTROLADOR: JUGADORES
 *
 * Recibe las peticiones HTTP, llama al service, y traduce
 * los errores de negocio a los mensajes exactos que pide
 * el documento de requisitos.
 * ==========================================================
 */

import {
  getJugadoresService,
  createJugadorService,
  updateJugadorService,
  desactivarJugadorService,
  getJugadorByIdService,
  getJugadoresPorEquipoService,
} from "../services/jugadoresService.js";

// =======================================
// OBTENER TODOS LOS JUGADORES
// =======================================
export const getJugadores = async (req, res) => {
  try {
    const jugadores = await getJugadoresService();
    res.json(jugadores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener jugadores" });
  }
};

// =======================================
// OBTENER JUGADOR POR ID
// =======================================
export const getJugadorById = async (req, res) => {
  try {
    const { id } = req.params;
    const jugador = await getJugadorByIdService(id);

    if (!jugador) {
      return res.status(404).json({ msg: "Jugador no encontrado" });
    }

    res.json(jugador);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener jugador" });
  }
};

// =======================================
// OBTENER JUGADORES POR EQUIPO
// (pestaña "Jugadores" del detalle de equipo)
// =======================================
export const getJugadoresPorEquipo = async (req, res) => {
  try {
    const { id_equipo } = req.params;
    const jugadores = await getJugadoresPorEquipoService(id_equipo);
    res.json(jugadores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener jugadores del equipo" });
  }
};

// =======================================
// CREAR JUGADOR
// 
// =======================================
export const createJugador = async (req, res) => {
  try {
    // El usuario logueado (DT) viene decodificado del token en req.user
    const id_usuario_dt = req.user.id_usuario;

    const result = await createJugadorService(req.body, id_usuario_dt);

    res.status(201).json({
      msg: "Jugador registrado exitosamente.",
      id: result.insertId,
    });

  } catch (error) {
    console.error(error);

    if (error.message === "EQUIPO_AJENO") {
      return res.status(403).json({
        msg: "No tiene permisos sobre este equipo.",
      });
    }

    if (error.message === "USUARIO_YA_TIENE_JUGADOR") {
      return res.status(409).json({
        msg: "El usuario ya está registrado como jugador.",
      });
    }

    if (error.message === "CAMISETA_DUPLICADA") {
      return res.status(409).json({
        msg: "El número de camiseta ya está en uso en este equipo.",
      });
    }

    res.status(500).json({ msg: "Error al crear jugador" });
  }
};

// =======================================
// ACTUALIZAR JUGADOR
// 
// =======================================
export const updateJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario_dt = req.user.id_usuario;

    await updateJugadorService(id, req.body, id_usuario_dt);

    res.json({ msg: "Jugador actualizado correctamente." });

  } catch (error) {
    console.error(error);

    if (error.message === "JUGADOR_NO_EXISTE") {
      return res.status(404).json({ msg: "Jugador no encontrado." });
    }

    if (error.message === "EQUIPO_AJENO") {
      return res.status(403).json({
        msg: "No tiene permisos para editar este jugador.",
      });
    }

    if (error.message === "CAMISETA_DUPLICADA") {
      return res.status(409).json({
        msg: "El número de camiseta ya está en uso.",
      });
    }

    res.status(500).json({ msg: "Error al actualizar jugador" });
  }
};

// =======================================
// DESACTIVAR JUGADOR (borrado lógico)
// 
//
//  si el equipo tiene un encuentro en curso, primero se
// avisa (409 con una bandera especial) en vez de desactivar de
// una vez. El frontend vuelve a llamar este mismo endpoint
// mandando ?forzar=true cuando el DT confirma que quiere seguir.
// =======================================
export const desactivarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario_dt = req.user.id_usuario;

    // Leemos la bandera "forzar" que puede venir en la URL:
    // /api/jugadores/5?forzar=true
    const forzar = req.query.forzar === "true";

    await desactivarJugadorService(id, id_usuario_dt, forzar);

    res.json({ msg: "Jugador desactivado correctamente." });

  } catch (error) {
    console.error(error);

    if (error.message === "JUGADOR_NO_EXISTE") {
      return res.status(404).json({ msg: "Jugador no encontrado." });
    }

    if (error.message === "EQUIPO_AJENO") {
      return res.status(403).json({
        msg: "No tiene permisos para desactivar este jugador.",
      });
    }

    if (error.message === "ENCUENTRO_EN_CURSO") {
      return res.status(409).json({
        msg: "El equipo tiene un encuentro en curso asociado.",
        requiereConfirmacion: true,
      });
    }

    res.status(500).json({ msg: "Error al desactivar jugador" });
  }
};