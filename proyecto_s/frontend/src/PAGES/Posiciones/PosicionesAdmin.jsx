import { useEffect, useState } from "react";

import { getTablaPosiciones } from "../../SERVICE/posicionesService";

import "../../STILO/estilosPages/encuentros/encuentros.css";
import Pagination from "../../COMPONENTES/Pagination";

export default function Posiciones() {
  const [posiciones, setPosiciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 7;
  
  const id_torneo = 2;

  // ======================================================
  // CARGAR POSICIONES
  // ======================================================

  const cargarPosiciones = async () => {
    try {
      setLoading(true);

      const res = await getTablaPosiciones(id_torneo);

      setPosiciones(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPosiciones();
  }, []);

  const ultimoRegistro = paginaActual * registrosPorPagina;
  const primerRegistro = ultimoRegistro - registrosPorPagina;

  const posicionesPaginadas = posiciones.slice(
    primerRegistro,
    ultimoRegistro
  );
  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <div className="header-tabla">
          <div>
            <h2 className="titulo">Tabla de Posiciones</h2>

            <h3 className="titulo">{posiciones[0]?.nombre_torneo}</h3>
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
              posicionesPaginadas.map((e, index) => (
                <tr key={e.id_equipo}>
                  <td>{index + 1}</td>

                  <td>{e.nombre_equipo}</td>

                  <td>{e.partidos_jugados}</td>

                  <td>{e.ganados}</td>

                  <td>{e.empatados}</td>

                  <td>{e.perdidos}</td>

                  <td>{e.goles_favor}</td>

                  <td>{e.goles_contra}</td>

                  <td>{e.diferencia_gol}</td>

                  <td>{e.puntos}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">
                  {loading ? "Cargando posiciones..." : "No hay datos"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          totalRegistros={posiciones.length}
          registrosPorPagina={registrosPorPagina}
          paginaActual={paginaActual}
          setPaginaActual={setPaginaActual}
        />
      </div>
    </div>
  );
}
