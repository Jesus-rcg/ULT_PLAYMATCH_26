import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getTablaPosiciones } from "../../SERVICE/posicionesService";

import "../../STILO/estilosPages/encuentros/encuentros.css";

export default function PosicionesOrganizador() {
  const { id } = useParams();

  const [posiciones, setPosiciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarPosiciones = async () => {
    try {
      setLoading(true);

      const res = await getTablaPosiciones(id);

      setPosiciones(res.data || []);
    } catch (error) {
      console.error("Error cargando posiciones:", error);
      setPosiciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      cargarPosiciones();
    }
  }, [id]);

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <div className="header-tabla">
          <div>
            <h2 className="titulo">Tabla de Posiciones</h2>

            <h3 className="titulo">{posiciones[0]?.nombre_torneo || ""}</h3>
          </div>

          <div className="acciones-header">
            <button className="btn crear" onClick={cargarPosiciones}>
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>PG</th>
              <th>PE</th>
              <th>PP</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>PTS</th>
            </tr>
          </thead>

          <tbody>
            {posiciones.length > 0 ? (
              posiciones.map((equipo, index) => (
                <tr key={equipo.id_equipo}>
                  <td>{index + 1}</td>
                  <td>{equipo.nombre_equipo}</td>
                  <td>{equipo.partidos_jugados}</td>
                  <td>{equipo.ganados}</td>
                  <td>{equipo.empatados}</td>
                  <td>{equipo.perdidos}</td>
                  <td>{equipo.goles_favor}</td>
                  <td>{equipo.goles_contra}</td>
                  <td>{equipo.diferencia_gol}</td>
                  <td>
                    <strong>{equipo.puntos}</strong>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">
                  {loading
                    ? "Cargando posiciones..."
                    : "No hay posiciones registradas"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
