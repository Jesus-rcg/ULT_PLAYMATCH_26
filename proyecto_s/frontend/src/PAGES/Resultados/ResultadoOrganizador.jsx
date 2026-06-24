import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getResultadoByEncuentro } from "../../SERVICE/resultadosService";

import "../../STILO/estilosPages/encuentros/encuentros.css";

import {
  getEncuentrosByTorneo,
  generarFixtureAutomatico,
  deleteEncuentro,
} from "../../SERVICE/encuentrosService";

export default function ResultadoOrganizador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [, setTick] = useState(0);
  const [encuentros, setEncuentros] = useState([]);
  const [resultados, setResultados] = useState({});
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // CARGAR RESULTADOS
  // -----------------------------
  const cargarResultados = async (encuentrosData) => {
    const data = {};

    await Promise.all(
      encuentrosData.map(async (e) => {
        try {
          const res = await getResultadoByEncuentro(e.id_encuentro);

          // 🔥 FIX CLAVE: manejar distintas respuestas del backend
          const resultado = res?.data ||
            res?.[0] ||
            res || {
              goles_local: 0,
              goles_visitante: 0,
            };

          data[Number(e.id_encuentro)] = resultado;
        } catch (error) {
          data[Number(e.id_encuentro)] = {
            goles_local: 0,
            goles_visitante: 0,
          };
        }
      }),
    );

    setResultados(data);
  };

  // -----------------------------
  // CARGAR ENCUENTROS
  // -----------------------------
  const cargarEncuentros = async () => {
    try {
      const data = await getEncuentrosByTorneo(id);

      setEncuentros(data || []);
      await cargarResultados(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
    if (!id) return;
    cargarEncuentros();
  }, [id]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // -----------------------------
  // AGRUPAR POR JORNADA
  // -----------------------------
  const encuentrosPorJornada = encuentros.reduce((acc, encuentro) => {
    const jornada = encuentro.jornada;

    if (!acc[jornada]) acc[jornada] = [];

    acc[jornada].push(encuentro);

    return acc;
  }, {});

  const calcularTiempoPartido = (id_encuentro) => {
    const inicio = localStorage.getItem(`partido_inicio_${id_encuentro}`);

    const activo =
      localStorage.getItem(`partido_activo_${id_encuentro}`) === "true";

    const estado = localStorage.getItem(`partido_estado_${id_encuentro}`) || "";

    let segundos =
      Number(localStorage.getItem(`partido_segundos_${id_encuentro}`)) || 0;

    if (activo && inicio) {
      segundos = Math.floor((Date.now() - Number(inicio)) / 1000);
    }

    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return {
      tiempo: `${String(minutos).padStart(2, "0")}:${String(
        segundosRestantes,
      ).padStart(2, "0")}`,
      estado,
      activo,
    };
  };

  return (
    <div>
      <h2>Resultado</h2>

      {encuentros.length === 0 ? (
        <p>No hay encuentros registrados</p>
      ) : (
        Object.entries(encuentrosPorJornada).map(([jornada, partidos]) => (
          <div className="contenedor-encuentro-card" key={jornada}>
            <h2 className="titulo-jornada">Jornada {jornada}</h2>

            {partidos.map((encuentro) => {
              const tiempo = calcularTiempoPartido(encuentro.id_encuentro);
              const resultado = resultados[Number(encuentro.id_encuentro)];

              return (
                <div
                  key={encuentro.id_encuentro}
                  className="encuentro-card"
                  onClick={() =>
                    navigate(`/alineacion/${encuentro.id_encuentro}`)
                  }
                >
                  {/* FECHA */}
                  <div className="fecha">
                    {encuentro.fecha
                      ?.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                  </div>

                  {/* PARTIDO + MARCADOR */}
                  <div className="partido">
                    <span className="equipo-e">{encuentro.equipo_local}</span>

                    <div>
                      <div className="tiempo-partido">
                        {encuentro.estado === "Finalizado" ? (
                          <div> Finalizado</div>
                        ) : (
                          <div> {tiempo?.tiempo || "00:00"}</div>
                        )}
                      </div>

                      <div className="marcador">
                        <strong>
                          {resultado?.goles_local ?? 0} -{" "}
                          {resultado?.goles_visitante ?? 0}
                        </strong>
                      </div>
                    </div>

                    <span className="equipo-e">
                      {encuentro.equipo_visitante}
                    </span>
                  </div>

                  {/* INFO */}
                  <div className="lugar-e">{encuentro.lugar}</div>

                  <div className="hora">{encuentro.hora?.slice(0, 5)}</div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
