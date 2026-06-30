import { useEffect, useState } from "react";

import "../../STILO/estilosPages/encuentros/encuentros.css";

const API = import.meta.env.VITE_API_URL + "/inscripcionJugadores";

export default function InscripcionesJugadoresOrganizador({ id_torneo }) {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtro, setFiltro] = useState("Pendiente");

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

  const actualizarEstado = async (id_inscripcion_j, estado, activo) => {
    try {
      const res = await fetch(`${API}/${id_inscripcion_j}`, {
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
          ins.id_inscripcion_j === id_inscripcion_j
            ? { ...ins, estado, activo }
            : ins,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filtrados = inscripciones.filter(
    (i) => String(i.id_torneo) === String(id_torneo) && i.estado === filtro,
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Inscripciones de jugadores</h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          className={filtro === "Pendiente" ? "btn-aceptar" : "btn-rechazar"}
          onClick={() => setFiltro("Pendiente")}
        >
          Pendientes
        </button>

        <button
          className={filtro === "Inscrito" ? "btn-aceptar" : "btn-rechazar"}
          onClick={() => setFiltro("Inscrito")}
        >
          Inscritos
        </button>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && filtrados.length === 0 && (
        <p>No hay inscripciones para este filtro</p>
      )}

      {filtrados.map((inscripcion) => (
        <div
          key={inscripcion.id_inscripcion_j}
          className="encuentro-card"
          style={{ marginBottom: "15px" }}
        >
          <div className="partido">
            <span className="equipo-e">{inscripcion.nombre_usuario}</span>

            <span className="equipo-e">{inscripcion.nombre_equipo}</span>

            <div className="tiempo-partido">Estado</div>

            <div className="equipo-e">{inscripcion.estado}</div>
          </div>

          <div className="lugar-e">Torneo: {inscripcion.nombre_torneo}</div>

          <div className="lugar-e">
            Fecha inscripción:{" "}
            {new Date(inscripcion.fecha_ins_jugador).toLocaleDateString(
              "es-CO",
            )}
          </div>

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
                  className="btn-aceptar"
                  onClick={() =>
                    actualizarEstado(
                      inscripcion.id_inscripcion_j,
                      "Inscrito",
                      1,
                    )
                  }
                >
                  Aceptar
                </button>

                <button
                  className="btn-rechazar"
                  onClick={() =>
                    actualizarEstado(
                      inscripcion.id_inscripcion_j,
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
                className="btn-rechazar"
                onClick={() =>
                  actualizarEstado(inscripcion.id_inscripcion_j, "Pendiente", 1)
                }
              >
                Pasar a Pendiente
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
