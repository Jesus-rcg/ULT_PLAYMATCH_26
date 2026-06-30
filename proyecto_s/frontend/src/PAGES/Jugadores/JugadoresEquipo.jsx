import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getJugadoresByEquipo } from "../../SERVICE/cronologiasService";
import { getEquipoById } from "../../SERVICE/equiposService";

import "../../STILO/estilosPages/jugadores/Jugadores.css";

export default function JugadoresEquipo() {
  const { idEquipo } = useParams();
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);

  const cargarDatos = async () => {
    try {
      const equipoData = await getEquipoById(idEquipo);
      setEquipo(equipoData);

      const jugadoresData = await getJugadoresByEquipo(idEquipo);
      setJugadores(jugadoresData || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (idEquipo) {
      cargarDatos();
    }
  }, [idEquipo]);

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
              <span className="torneo-subtitulo">Jugadores inscritos:</span>{" "}
              {jugadores.length}
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
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Plantilla del equipo</h2>

          <button
            className="btn-inscribir-equipo"
            onClick={() =>
              navigate(`/inscripcionJugadoresOrganizador/crear/${idEquipo}`)
            }
          >
            + Inscribir Jugador
          </button>
        </div>

        {jugadores.length === 0 ? (
          <p>No hay jugadores inscritos.</p>
        ) : (
          <div className="contenedor-encuentro-card">
            {jugadores.map((j) => (
              <div key={j.id_jugador} className="encuentro-card">
                <div className="partido">
                  <div className="equipo-e">
                    <span className="eql">
                      {j.nombre_usuario} {j.apellido_usuario}
                    </span>
                  </div>

                  <div className="vs">#{j.numero_camiseta}</div>

                  <div className="equipo-e">
                    <span>{j.posicion}</span>
                  </div>
                </div>

                <div className="lugar-e">Equipo: {equipo.nombre_equipo}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
