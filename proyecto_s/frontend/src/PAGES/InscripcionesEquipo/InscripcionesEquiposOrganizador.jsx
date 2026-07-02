import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../STILO/estilosPages/encuentros/encuentros.css";

const API = import.meta.env.VITE_API_URL + "/inscripcionEquipos";

export default function InscripcionesEquiposOrganizador({ id_torneo }) {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtro, setFiltro] = useState("Pendiente");

  const navigate = useNavigate();

  const getInscripciones = async () => {
    try {
      setLoading(true);

      const res = await fetch(API);
      const data = await res.json();

      setInscripciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInscripciones();
  }, []);

  const actualizarEstado = async (id_inscripcion_e, estado, activo) => {
    try {
      const res = await fetch(`${API}/${id_inscripcion_e}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado,
          activo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setInscripciones((prev) =>
        prev.map((ins) =>
          ins.id_inscripcion_e === id_inscripcion_e
            ? { ...ins, estado, activo }
            : ins,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filtrados = inscripciones.filter((i) => {
    return String(i.id_torneo) === String(id_torneo) && i.estado === filtro;
  });

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Inscripciones del torneo</h2>
      </div>

      {/* BOTONES FILTRO */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
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
          Equipos Inscritos
        </button>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && filtrados.length === 0 && (
        <p>No hay inscripciones para este filtro</p>
      )}

      {/* CARDS */}
      {filtrados.map((inscripcion) => (
        <div
          key={inscripcion.id_inscripcion_e}
          className="encuentro-card"
          style={{ marginBottom: "15px" }}
        >
          <div className="partido">
            <span className="equipo-e">{inscripcion.nombre_torneo}</span>

            <span className="equipo-e">{inscripcion.nombre_equipo}</span>

            <div className="tiempo-partido">Estado</div>

            <div className="equipo-e">{inscripcion.estado}</div>
          </div>

          <div className="lugar-e">
            Fecha inscripción:{" "}
            {new Date(inscripcion.fecha_ins_equipo).toLocaleDateString("es-CO")}
          </div>

          {/* ACCIONES */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {inscripcion.estado === "Pendiente" && (
              <>
                <button
                  className="btn-aceptar-i"
                  onClick={() =>
                    actualizarEstado(
                      inscripcion.id_inscripcion_e,
                      "Inscrito",
                      1,
                    )
                  }
                >
                  Aceptar
                </button>

                <button
                  className="btn-rechazar-i"
                  onClick={() =>
                    actualizarEstado(
                      inscripcion.id_inscripcion_e,
                      "Cancelado",
                      0,
                    )
                  }
                >
                  Rechazar
                </button>
              </>
            )}

            {inscripcion.estado === "Inscrito" && (
              <button
                className="btn-pendiente"
                onClick={() =>
                  actualizarEstado(inscripcion.id_inscripcion_e, "Pendiente", 1)
                }
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
