import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResultados } from "../../SERVICE/resultadosService";

export default function Resultados() {
  const navigate = useNavigate();

  const [resultados, setResultados] = useState([]);

  const cargarResultados = async () => {
    try {
      const data = await getResultados();

      setResultados(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarResultados();
  }, []);

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <div className="header-tabla">
          <h2 className="titulo">Resultados</h2>

          <button
            className="btn crear"
            onClick={() => navigate("/resultados/Crear")}
          >
            Crear
          </button>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Encuentro</th>
              <th>Equipos</th>
              <th>Goles Local</th>
              <th>Goles Visitante</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {resultados.length > 0 ? (
              resultados.map((r) => (
                <tr key={r.id_resultado}>
                  <td>{r.id_resultado}</td>
                  <td>{r.id_encuentro}</td>

                  <td>
                    {r.equipo_local} vs {r.equipo_visitante}
                  </td>

                  <td>{r.goles_local}</td>

                  <td>{r.goles_visitante}</td>

                  <td className="acciones">
                    <button
                      className="btn editar"
                      onClick={() =>
                        navigate(`/resultados/Editar/${r.id_resultado}`)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn eliminar"
                      onClick={() =>
                        navigate(`/resultados/Eliminar/${r.id_resultado}`)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
