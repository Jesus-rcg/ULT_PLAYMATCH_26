import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEquipoById } from "../../SERVICE/equiposService";

import "../../STILO/estilosPages/encuentros/encuentros.css";
import "../../STILO/estilosPages/jugadores/Jugadores.css";

export default function SolicitudesJugadoresEquipo() {
  const { idEquipo } = useParams();

  const API = import.meta.env.VITE_API_URL + "/inscripcionJugadores";
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Pendiente");

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);

      const equipoData = await getEquipoById(idEquipo);
      setEquipo(equipoData);

      const res = await fetch(`${API}/equipo/${idEquipo}/solicitudes`);
      const data = await res.json();

      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [idEquipo]);

  const actualizarEstado = async (id, estado) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      await cargarSolicitudes();

      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el estado");
    }
  };

  const solicitudesFiltradas = solicitudes.filter((s) => s.estado === filtro);

  if (!equipo) return <p>Cargando...</p>;

  return (
    <div className="detalle-container">
      {/* HEADER */}
      <header className="detalle-header-1">
        <h1>{equipo.nombre_equipo}</h1>

        <div className="data-detalle">
          <div>
            <img src={equipo.escudo} alt={equipo.nombre_equipo} />
          </div>

          <div className="info">
            <p>
              <span className="torneo-subtitulo">Capitán:</span>{" "}
              {equipo.nombre_usuario}
            </p>

            <p>
              <span className="torneo-subtitulo">Solicitudes:</span>{" "}
              {solicitudes.length}
            </p>

            <p>
              <span className="torneo-subtitulo">Estado:</span> {equipo.estado}
            </p>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="detalle-main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <h2>Solicitudes de jugadores</h2>

          <button className="btn-volver" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            justifyContent: "center",
          }}
        >
          <button
            className={
              filtro === "Pendiente" ? "btn-inscritos" : "btn-pendientes-i"
            }
            onClick={() => setFiltro("Pendiente")}
          >
            Pendientes
          </button>

          <button
            className={
              filtro === "Inscrito" ? "btn-inscritos" : "btn-pendientes-i"
            }
            onClick={() => setFiltro("Inscrito")}
          >
            Inscritos
          </button>

          <button
            className={
              filtro === "Cancelado" ? "btn-inscritos" : "btn-pendientes-i"
            }
            onClick={() => setFiltro("Cancelado")}
          >
            Cancelados
          </button>
        </div>

        {loading && <p>Cargando...</p>}

        {!loading && solicitudesFiltradas.length === 0 && (
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              marginTop: "20px",
            }}
          >
            No hay solicitudes para este filtro.
          </p>
        )}

        {!loading &&
          solicitudesFiltradas.map((j) => (
            <div key={j.id_inscripcion_j} className="encuentro-card">
              <div className="partido">
                <div className="equipo-e">
                  <span className="eql">
                    {j.nombre_usuario} {j.apellido_usuario}
                  </span>
                </div>

                <div className="vs">#{j.numero_camiseta}</div>

                <div className="equipo-e">{j.posicion}</div>
              </div>

              <div className="lugar-e">
                Fecha de inscripción:{" "}
                {new Date(j.fecha_inscripcion).toLocaleDateString("es-CO")}
              </div>

              <div className="lugar-e">Estado: {j.estado}</div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                {j.estado === "Pendiente" && (
                  <>
                    <button
                      className="btn-aceptar-i"
                      onClick={() =>
                        actualizarEstado(j.id_inscripcion_j, "Inscrito")
                      }
                    >
                      Aceptar
                    </button>

                    <button
                      className="btn-rechazar-i"
                      onClick={() =>
                        actualizarEstado(j.id_inscripcion_j, "Cancelado")
                      }
                    >
                      Rechazar
                    </button>
                  </>
                )}

                {j.estado === "Inscrito" && (
                  <button
                    className="btn-pendiente"
                    onClick={() =>
                      actualizarEstado(j.id_inscripcion_j, "Pendiente")
                    }
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}
