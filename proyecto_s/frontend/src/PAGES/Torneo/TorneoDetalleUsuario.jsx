import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { getTorneoById } from "../../SERVICE/torneoService";
import { getEncuentrosByTorneo } from "../../SERVICE/encuentrosService";

import "../../STILO/estilosPages/TorneoDetalle.css";

export default function TorneoDetalleOrganizador() {
  const { id } = useParams();

  const [torneo, setTorneo] = useState(null);
  const [encuentros, setEncuentros] = useState([]);

  const [tab, setTab] = useState("encuentros");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // 🔥 TORNEO
        const torneoData = await getTorneoById(id);
        setTorneo(Array.isArray(torneoData) ? torneoData[0] : torneoData);

        // 🔥 ENCUENTROS
        const encuentrosData = await getEncuentrosByTorneo(id);
        setEncuentros(Array.isArray(encuentrosData) ? encuentrosData : []);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el torneo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Cargando torneo...</p>;

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!torneo) {
    return <p>No se encontró el torneo</p>;
  }

  return (
    <div className="detalle-container">
      {/* HEADER */}
      <header className="detalle-header">
        <h1>{torneo.nombre_torneo}</h1>
        <p>📍 Ciudad: {torneo.ciudad}</p>
        <p>🏆 Categoria: {torneo.categoria}</p>
        <p>📌 Estado: {torneo.estado}</p>
        <p>📌 tipo de torneo: {torneo.tipo_torneo}</p>
        <p>
          📌 Fecha de Inicio:{" "}
          {new Date(torneo.fecha_inicio).toLocaleDateString()}
        </p>
        <p>
          📌 Fecha de Inicio: {new Date(torneo.fecha_fin).toLocaleDateString()}
        </p>

        {/* TABS */}
        <nav className="detalle-nav">
          <button
            className={tab === "encuentros" ? "active" : ""}
            onClick={() => setTab("encuentros")}
          >
            Encuentros
          </button>

          <button
            className={tab === "resultados" ? "active" : ""}
            onClick={() => setTab("resultados")}
          >
            Resultados
          </button>

          <button
            className={tab === "posiciones" ? "active" : ""}
            onClick={() => setTab("posiciones")}
          >
            Posiciones
          </button>

          <button
            className={tab === "posiciones" ? "active" : ""}
            onClick={() => setTab("posiciones")}
          >
            equipos
          </button>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main className="detalle-main">
        {/* ENCUENTROS */}
        {tab === "encuentros" && (
          <div>
            <h2>📅 Encuentros</h2>

            {encuentros.length === 0 ? (
              <p>No hay encuentros registrados</p>
            ) : (
              encuentros.map((encuentro) => (
                <div key={encuentro.id_encuentro} className="encuentro-card">
                  <h3>
                    {encuentro.equipo_local} vs {encuentro.equipo_visitante}
                  </h3>

                  <p>
                    📅 Fecha: {new Date(encuentro.fecha).toLocaleDateString()}
                  </p>

                  <p>⏰ Hora: {encuentro.hora}</p>

                  <p>📍 Cancha: {encuentro.lugar}</p>

                  <p>📌 Estado: {encuentro.estado}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* RESULTADOS */}
        {tab === "resultados" && (
          <div>
            <h2>🏆 Resultados</h2>
            <p>Aquí puedes mostrar los resultados</p>
          </div>
        )}

        {/* INSCRIPCIONES */}
        {tab === "inscripciones" && (
          <div>
            <h2>📝 Inscripciones</h2>
            <p>Aquí puedes mostrar las inscripciones</p>
          </div>
        )}

        {/* POSICIONES */}
        {tab === "posiciones" && (
          <div>
            <h2>📊 Posiciones</h2>
            <p>Aquí puedes mostrar la tabla de posiciones</p>
          </div>
        )}
      </main>
    </div>
  );
}
