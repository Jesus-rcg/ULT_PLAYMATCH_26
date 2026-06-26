import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../CONTEXT/AuthContext";
import { getEquipoJugadorByUsuario } from "../../SERVICE/equiposService";

import "../../STILO/estilosPages/torneoCard.css";

export default function EquipoJugador() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEquipo = async () => {
      try {
        const data = await getEquipoJugadorByUsuario(user.id_usuario);
        setEquipo(data);
      } catch (error) {
        console.error(error);
        setEquipo(null);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id_usuario) {
      cargarEquipo();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="torneos-container">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="header-torneos">
        <h2>Mi Equipo</h2>
      </div>

      <div className="torneos-container">
        {equipo ? (
          <div
            className="torneo-card"
            onClick={() => navigate(`/jugadores/${equipo.id_equipo}`)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="torneo-title">{equipo.nombre_equipo}</h3>

            <div className="data-container">
              <div className="img-torneo">
                <img src={equipo.escudo} alt={equipo.nombre_equipo} />
              </div>

              <div className="data-torneo">
                <p>
                  <strong>Jugador:</strong> {equipo.nombre_usuario}
                </p>

                <p>
                  <strong>Estado:</strong> {equipo.estado}
                </p>
              </div>
            </div>

            <div className="foot-data">
              <div className="foot-data">
                <button
                  className="btn-editar"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jugadores/${equipo.id_equipo}`);
                  }}
                >
                  Ver Equipo
                </button>

                <button
                  className="btn-ver"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/torneos/${equipo.id_torneo}`);
                  }}
                >
                  Ver Torneo
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h2>No perteneces a ningún equipo</h2>

            <p>Aún no estás inscrito como jugador en ningún equipo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
