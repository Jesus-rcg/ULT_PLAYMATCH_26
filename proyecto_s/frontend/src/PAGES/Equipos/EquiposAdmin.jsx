import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEquipos } from "../../SERVICE/equiposService";
import "../../STILO/estilosPages/equipos/equipos.css";
import Pagination from "../../COMPONENTES/Pagination";

export default function Equipos() {
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 7;

  const [equipos, setEquipos] = useState([]);

  const cargarEquipos = async () => {
    try {
      const data = await getEquipos();
      setEquipos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const ultimoRegistro = paginaActual * registrosPorPagina;
  const primerRegistro = ultimoRegistro - registrosPorPagina;

  const equiposPaginados = equipos.slice(
    primerRegistro,
    ultimoRegistro
  );

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <div className="header-tabla">
          <h2 className="titulo">Equipos</h2>

          <button
            className="btn crear"
            onClick={() => navigate("/equipos/crear")}
          >
            Crear
          </button>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Escudo</th>
              <th>Equipo</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {equipos.length > 0 ? (
              equiposPaginados.map((e) => (
                <tr key={e.id_equipo}>
                  <td>{e.id_equipo}</td>

                  <td>
                    <img src={e.escudo} alt={e.nombre_equipo} width="60" />
                  </td>

                  <td>{e.nombre_equipo}</td>

                  <td>{e.nombre_usuario}</td>

                  <td className="acciones">
                    <button
                      className="btn editar"
                      onClick={() => navigate(`/equipos/editar/${e.id_equipo}`)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn eliminar"
                      onClick={() =>
                        navigate(`/equipos/eliminar/${e.id_equipo}`)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay equipos</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          totalRegistros={equipos.length}
          registrosPorPagina={registrosPorPagina}
          paginaActual={paginaActual}
          setPaginaActual={setPaginaActual}
        />
      </div>
    </div>
  );
}
