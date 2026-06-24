import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../CONTEXT/AuthContext";
import { getEquipoByUsuario } from "../../SERVICE/equiposService";

import "../../STILO/estilosPages/equipos/equipos.css";

export default function EquipoJugador() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarEquipo = async () => {
    try {
      const data = await getEquipoByUsuario(user.id_usuario);

      setEquipo(data);
    } catch (error) {
      console.error(error);
      setEquipo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id_usuario) {
      cargarEquipo();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="equipos-container">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="equipos-container">
      {equipo ? (
        <div className="equipo-card">
          <div className="equipo-logo">
            <img src={equipo.escudo} alt={equipo.nombre_equipo} />
          </div>

          <div className="equipo-info">
            <h2>{equipo.nombre_equipo}</h2>

            <p>
              <strong>Capitán:</strong> {equipo.nombre_usuario}
            </p>
          </div>

          <div style={{ marginTop: "15px" }}>
            <button
              className="btn editar"
              onClick={() => navigate(`/equipos/editar/${equipo.id_equipo}`)}
            >
              Ver Equipo
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h2>No perteneces a ningún equipo</h2>

          <p>Debes crear un equipo para participar en los torneos.</p>

          <button
            className="btn crear"
            onClick={() => navigate("/equipos/crear")}
          >
            Crear Equipo
          </button>
        </div>
      )}
    </div>
  );
}
