import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../STILO/estilosPages/encuentros/encuentrosOrganizador.css";

import {
  getEncuentrosByTorneo,
  generarFixtureAutomatico,
  deleteEncuentro,
} from "../../SERVICE/encuentrosService";

export default function ResultadoOrganizador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [encuentros, setEncuentros] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarEncuentros = async () => {
    try {
      const data = await getEncuentrosByTorneo(id);

      setEncuentros(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    cargarEncuentros();
  }, [id]);

  const handleGenerarFixture = async () => {
    try {
      setLoading(true);

      const res = await generarFixtureAutomatico({
        id_torneo: id,
      });

      alert(res.message);
      await cargarEncuentros();
    } catch (error) {
      console.error(error);
      alert("Error al generar encuentros");
    } finally {
      setLoading(false);
    }
  };

  const editarEncuentro = (id_encuentro) => {
    navigate(`/encuentros/editar/${id_encuentro}`);
  };

  const eliminarEncuentro = async (id_encuentro) => {
    if (!window.confirm("¿Deseas eliminar este encuentro?")) return;

    try {
      await deleteEncuentro(id_encuentro);
      await cargarEncuentros();
    } catch (error) {
      console.error(error);
    }
  };

  const encuentrosPorJornada = encuentros.reduce((acc, encuentro) => {
    const jornada = encuentro.jornada;

    if (!acc[jornada]) {
      acc[jornada] = [];
    }

    acc[jornada].push(encuentro);

    return acc;
  }, {});

  return (
    <div>
      <div>
        <h2>Resultado</h2>
      </div>
      {encuentros.length === 0 ? (
        <p>No hay encuentros registrados</p>
      ) : (
        Object.entries(encuentrosPorJornada).map(([jornada, partidos]) => (
          <div className="contenedor-encuentro-card" key={jornada}>
            <h2 className="titulo-jornada">Jornada {jornada}</h2>

            {partidos.map((encuentro) => (
              <div
                key={encuentro.id_encuentro}
                className="encuentro-card"
                onClick={() =>
                  navigate(`/alineacion/${encuentro.id_encuentro}`)
                }
              >
                <div className="fecha">
                  {encuentro.fecha
                    ?.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-")}
                </div>

                <div>
                  <div className="partido">
                    <div className="equipo-e">
                      <span className="eql">{encuentro.equipo_local}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="equipo-e">
                      <span>{encuentro.equipo_visitante}</span>
                    </div>
                  </div>

                  <div className="lugar-e">{encuentro.lugar}</div>
                </div>

                <div className="hora">{encuentro.hora?.slice(0, 5)}</div>

                <span>{encuentro.estado}</span>

                <div className="encuentro-acciones">
                  <button
                    className="btn-editar-e"
                    onClick={(e) => {
                      e.stopPropagation();
                      editarEncuentro(encuentro.id_encuentro);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-eliminar-e"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarEncuentro(encuentro.id_encuentro);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
