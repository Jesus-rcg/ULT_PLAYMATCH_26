import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../STILO/estilosPages/encuentros/encuentros.css";

const API = import.meta.env.VITE_API_URL + "/inscripcionEquipos";

export default function InscripcionesEquiposOrganizador({ id_torneo }) {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const actualizarEstado = async (id_inscripcion_e, nuevoEstado) => {
    try {
      await fetch(`${API}/${id_inscripcion_e}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: nuevoEstado,
        }),
      });

      setInscripciones((prev) =>
        prev.map((ins) =>
          ins.id_inscripcion_e === id_inscripcion_e
            ? { ...ins, estado: nuevoEstado }
            : ins,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };
  const filtrados = inscripciones.filter((i) => {
    const estado = (i.estado || "").toLowerCase();

    return (
      String(i.id_torneo) === String(id_torneo) &&
      (estado === "pendiente" || estado === "no inscrito")
    );
  });

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
        <h2>Inscripciones del torneo</h2>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && filtrados.length === 0 && (
        <p>No hay inscripciones para este torneo</p>
      )}

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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <div className="acciones-inscripcion">
              <button
                className="btn-aceptar"
                onClick={() => actualizarEstado(i.id_inscripcion_e, "Inscrito")}
              >
                Aceptar
              </button>

              <button
                className="btn-rechazar"
                onClick={() =>
                  actualizarEstado(i.id_inscripcion_e, "No Inscrito")
                }
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
