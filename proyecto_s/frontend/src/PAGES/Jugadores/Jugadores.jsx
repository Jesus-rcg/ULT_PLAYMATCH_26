import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJugadores } from "../../SERVICE/jugadoresService";
import "../../STILO/estilosPages/jugadores/jugadores.css";
import Pagination from "../../COMPONENTES/Pagination";

export default function Jugadores() {
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 7;

  const [jugadores, setJugadores] = useState([]);

  const cargarJugadores = async () => {
    try {
      const data = await getJugadores();
      setJugadores(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarJugadores();
  }, []);

  const ultimoRegistro = paginaActual * registrosPorPagina;
  const primerRegistro = ultimoRegistro - registrosPorPagina;

  const jugadoresPaginados = jugadores.slice(
    primerRegistro,
    ultimoRegistro
  );

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <div className="header-tabla">
          <h2 className="titulo">Jugadores</h2>

          <button
            className="btn crear"
            onClick={() => navigate("/jugadores/crear")}
          >
            Crear
          </button>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Posición</th>
              <th>Número</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {jugadores.length > 0 ? (
              jugadoresPaginados.map((j) => (
                <tr key={j.id_jugador}>
                  <td>{j.id_jugador}</td>

                  <td>{j.nombre_usuario}</td>

                  <td>{j.posicion}</td>

                  <td>{j.numero_camiseta}</td>

                  <td className="acciones">
                    <button
                      className="btn editar"
                      onClick={() =>
                        navigate(`/jugadores/editar/${j.id_jugador}`)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn eliminar"
                      onClick={() =>
                        navigate(`/jugadores/eliminar/${j.id_jugador}`)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay jugadores</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          totalRegistros={jugadores.length}
          registrosPorPagina={registrosPorPagina}
          paginaActual={paginaActual}
          setPaginaActual={setPaginaActual}
        />
      </div>
    </div>
  );
}
