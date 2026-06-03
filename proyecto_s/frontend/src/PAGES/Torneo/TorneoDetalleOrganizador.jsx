import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { getTorneoById } from "../../SERVICE/torneoService";

import Posiciones from "../Posiciones/Posiciones";
import Resultados from "../Resultados/Resultados";
import Equipos from "../Equipos/Equipos";
import InscripcionesEquipos from "../InscripcionesEquipo/inscripcionesEquipos";
import Encuentros from "../Encuentros/Encuentros";

import trofeo from "../../ASSETS/trofeo.jpg";
import "../../STILO/estilosPages/torneoDetalle.css";

export default function TorneoDetalleOrganizador() {
  const { id } = useParams();

  const [torneo, setTorneo] = useState(null);

  const [tab, setTab] = useState("encuentros");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const torneoData = await getTorneoById(id);
        setTorneo(Array.isArray(torneoData) ? torneoData[0] : torneoData);
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
        <div className="data-detalle">
          <div>
            <img src={trofeo} alt="Logo" />
          </div>
          <div>
            <p>Categoria: {torneo.categoria}</p>
            <p>tipo de torneo: {torneo.tipo_torneo}</p>
            <p>Estado: {torneo.ciudad}</p>

            <p>
              Fecha de Finalizacion:{" "}
              {new Date(torneo.fecha_fin).toLocaleDateString()}
            </p>
          </div>
        </div>
        {/* TABS */}
        <nav className="detalle-nav">
          <button
            className={tab === "posiciones" ? "active" : ""}
            onClick={() => setTab("posiciones")}
          >
            Posiciones
          </button>

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
            className={tab === "equipos" ? "active" : ""}
            onClick={() => setTab("equipos")}
          >
            equipos
          </button>

          <button
            className={tab === "inscripciones" ? "active" : ""}
            onClick={() => setTab("inscripciones")}
          >
            Inscripciones
          </button>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main className="detalle-main">
        {tab === "posiciones" && <Posiciones id_torneo={id} />}
        {tab === "encuentros" && <Encuentros id_torneo={id} />}

        {tab === "resultados" && <Resultados id_torneo={id} />}

        {tab === "equipos" && <Equipos id_torneo={id} />}

        {tab === "inscripciones" && <InscripcionesEquipos id_torneo={id} />}
      </main>
    </div>
  );
}
