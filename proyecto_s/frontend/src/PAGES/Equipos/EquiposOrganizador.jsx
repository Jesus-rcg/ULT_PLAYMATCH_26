import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEquiposByTorneo } from "../../SERVICE/equiposService";

import "../../STILO/estilosPages/equipos/equipos.css";

export default function Equipos() {
  const { id } = useParams(); // id del torneo
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);

  const cargarEquipos = async () => {
    try {
      const data = await getEquiposByTorneo(id);
      setEquipos(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      cargarEquipos();
    }
  }, [id]);

  return (
    <div className="equipos-container">
      <div className="header-equipos">
        <h2 className="titulo-equipos">Equipos Inscritos</h2>

        <button
          className="btn-inscribir-equipo"
          onClick={() => navigate(`/inscripcionEquipos/Crear/${id}`)}
        >
          + Inscribir Equipo
        </button>
      </div>

      {equipos.length === 0 ? (
        <div className="empty-state">
          <h3>No hay equipos inscritos</h3>
          <p>Aún no hay equipos en este torneo</p>
        </div>
      ) : (
        <div className="grid-equipos">
          {equipos.map((e) => (

              <div>
                <span>{e.id_equipo}</span>
              </div>
              <div className="equipo-logo">
                <img src={e.escudo} alt={e.nombre_equipo} />
              </div>

              <div className="equipo-info">
                <h3>{e.nombre_equipo}</h3>
                <p>{e.nombre_usuario}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
