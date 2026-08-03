// ===================================================================
// JugadorEditar.jsx
// Formulario para que el DT actualice el número de camiseta de un
// jugador que ya pertenece a uno de sus equipos 
// ===================================================================

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Servicios que ya creamos antes
import {
  getJugadorById,
  updateJugador,
} from "../../SERVICE/jugadoresService";

import { AuthContext } from "../../CONTEXT/AuthContext";

import "../../STILO/estilosPages/jugadores/Jugadores.css";

export default function JugadorEditar() {
  // El parámetro viene de la URL: /jugadores/editar/:id
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ----------------------------
  // ESTADOS
  // ----------------------------
  const [jugador, setJugador] = useState(null); // datos originales
  const [numeroCamiseta, setNumeroCamiseta] = useState(""); // valor del input

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // ----------------------------
  // CARGA INICIAL: traemos los datos actuales del jugador
  // ----------------------------
  useEffect(() => {
    const cargarJugador = async () => {
      try {
        setCargando(true);
        const data = await getJugadorById(id);
        setJugador(data);
        // Ponemos el número de camiseta actual en el input
        setNumeroCamiseta(data.numero_camiseta);
      } catch (err) {
        console.error(err);
        setMensajeError("No se pudo cargar la información del jugador.");
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      cargarJugador();
    }
  }, [id]);

  // ----------------------------
  // FUNCIÓN: manejarEnvio
  // Se ejecuta cuando el DT le da clic a "Guardar Cambios"
  // ----------------------------
  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    setMensajeExito("");
    setMensajeError("");

    if (!numeroCamiseta) {
      setMensajeError("Debes escribir el número de camiseta.");
      return;
    }

    try {
      setEnviando(true);

      await updateJugador(id, {
        numero_camiseta: numeroCamiseta,
      });

      setMensajeExito("Jugador actualizado exitosamente.");

      setTimeout(() => {
        navigate(`/jugadoresEquipo/${jugador.id_equipo}`);
      }, 1500);
    } catch (err) {
      console.error(err);

      // El backend manda el mensaje exacto en el campo "msg"
      const mensajeBackend =
        err.response?.data?.msg ||
        "Ocurrió un error al actualizar el jugador.";
      setMensajeError(mensajeBackend);
    } finally {
      setEnviando(false);
    }
  };

  // ----------------------------
  // RENDERIZADO CONDICIONAL
  // ----------------------------
  if (cargando) return <p>Cargando...</p>;
  if (!jugador) return <p>Jugador no encontrado.</p>;

  // ----------------------------
  // RENDERIZADO PRINCIPAL: el formulario
  // ----------------------------
  return (
    <div className="detalle-container">
      <header className="detalle-header-1">
        <h1>Editar Jugador</h1>
      </header>

      <main className="detalle-main">
        <form onSubmit={manejarEnvio} className="form-jugador">
          {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
          {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

          {/* Mostramos el nombre del jugador solo como referencia,
              no se puede editar  */}
          <p>
            Jugador: <strong>{jugador.nombre_usuario} {jugador.apellido_usuario}</strong>
          </p>

          <label htmlFor="camiseta">Número de camiseta:</label>
          <input
            id="camiseta"
            type="number"
            min="1"
            value={numeroCamiseta}
            onChange={(e) => setNumeroCamiseta(e.target.value)}
          />

          <div className="form-botones">
            <button type="submit" className="btn-inscribir-equipo" disabled={enviando}>
              {enviando ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              className="btn-desactivar-jugador"
              onClick={() => navigate(`/jugadoresEquipo/${jugador.id_equipo}`)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}