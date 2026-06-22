import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEquiposByTorneo } from "../../SERVICE/equiposService";
import "../../STILO/estilosPages/equipos/equipos.css";

export default function Equipos() {
  const { id } = useParams();

  const [equipos, setEquipos] = useState([]);

  const cargarEquipos = async () => {
    try {
      const data = await getEquiposByTorneo(id);
      setEquipos(data);
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
      {/* HEADER */}
      <div className="header-equipos">
        <h2 className="titulo-equipos"> Equipos Inscritos</h2>
      </div>

      {/* EMPTY STATE */}
      {equipos.length === 0 ? (
        <div className="empty-state">
          <h3>No hay equipos inscritos</h3>
          <p>Aún no hay equipos en este torneo</p>
        </div>
      ) : (
        <div className="grid-equipos">
          {equipos.map((e) => (
            <div key={e.id_equipo} className="equipo-card">
              {/* ESCUDO */}
              <div className="equipo-logo">
                <img src={e.escudo} alt={e.nombre_equipo} />
              </div>

              <div className="equipo-info">
                <h3>{e.nombre_equipo}</h3>
                <p> {e.nombre_usuario}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
