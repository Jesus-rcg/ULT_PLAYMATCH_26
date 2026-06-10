import { useEffect, useState } from "react";
import {
  getCronologias,
  getEncuentroDetalle,
  getJugadoresByEquipo,
} from "../../SERVICE/cronologiasService";
import { useParams } from "react-router-dom";
import "../../STILO/estilosPages/cronologias/cronologias.css";

import escudoA from "../../ASSETS/escudo 1.jpg";
import escudoB from "../../ASSETS/escudo 2.jpg";
import campo from "../../ASSETS/campo12.png";

export default function CronologiasOrganizador() {
  const { id } = useParams();

  const [cronologias, setCronologias] = useState([]);
  const [encuentro, setEncuentro] = useState(null);

  const [equipoActivo, setEquipoActivo] = useState("A");
  const [posiciones, setPosiciones] = useState({});

  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);

  const equipoLocal = encuentro?.equipo_local || "Equipo Local";
  const equipoVisitante = encuentro?.equipo_visitante || "Equipo Visitante";

  const cargarCronologias = async () => {
    try {
      const data = await getCronologias();
      setCronologias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarEncuentro = async () => {
    try {
      const data = await getEncuentroDetalle(id);

      setEncuentro(data);

      const jugadoresLocalData = await getJugadoresByEquipo(
        data.id_equipo_local,
      );

      const jugadoresVisitanteData = await getJugadoresByEquipo(
        data.id_equipo_visitante,
      );

      setJugadoresLocal(jugadoresLocalData);
      setJugadoresVisitante(jugadoresVisitanteData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarCronologias();

    if (id) {
      cargarEncuentro();
    }
  }, [id]);

  const handleDragStart = (e, jugador) => {
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.setData("jugador", JSON.stringify(jugador));
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDrop = (e, posicionNueva) => {
    e.preventDefault();

    const jugador = JSON.parse(e.dataTransfer.getData("jugador"));

    setPosiciones((prev) => {
      const nuevasPosiciones = { ...prev };

      // Buscar dónde estaba el jugador
      Object.keys(nuevasPosiciones).forEach((pos) => {
        if (nuevasPosiciones[pos]?.id_jugador === jugador.id_jugador) {
          delete nuevasPosiciones[pos];
        }
      });

      // Asignarlo a la nueva posición
      nuevasPosiciones[posicionNueva] = jugador;

      return nuevasPosiciones;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const equipoA = {
    nombre: equipoLocal,
    banca: jugadoresLocal,
  };

  const equipoB = {
    nombre: equipoVisitante,
    banca: jugadoresVisitante,
  };

  return (
    <div className="contenedor">
      <div className="bloques">
        <div className="marcador">
          <div className="escudo" onClick={() => setEquipoActivo("A")}>
            <img src={escudoA} alt="Equipo Local" />
            <h3>{equipoLocal}</h3>
          </div>

          <div>
            <h1>ALINEACION</h1>
          </div>

          <div className="escudo" onClick={() => setEquipoActivo("B")}>
            <img src={escudoB} alt="Equipo Visitante" />
            <h3>{equipoVisitante}</h3>
          </div>
        </div>

        <div className="contenedor-cancha">
          <div
            className="cancha"
            style={{
              backgroundImage: `url(${campo})`,
            }}
          >
            {/* EQUIPO A */}
            <div className="mitad">
              <div className="zona-portero">
                <div
                  className={`portero ${posiciones["b-por-2"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-por-2")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-por-2"]}
                  onDragStart={(e) =>
                    posiciones["b-por-2"] &&
                    handleDragStart(e, posiciones["b-por-2"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-por-2"]
                        ? posiciones["b-por-2"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-por-2"]
                        ? posiciones["b-por-2"].nombre_usuario
                        : "POR"}
                    </div>
                  </div>
                </div>
              </div>

              {/***********************Defensa************************************************** */}
              <div className="zona-defensa">
                <div
                  className={`defensa lateral-derecho-2 ${posiciones["b-def-6"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-6")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-6"]}
                  onDragStart={(e) =>
                    posiciones["b-def-6"] &&
                    handleDragStart(e, posiciones["b-def-6"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-6"]
                        ? posiciones["b-def-6"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-6"]
                        ? posiciones["b-def-6"].nombre_usuario
                        : "LD"}
                    </div>
                  </div>
                </div>

                <div
                  className={`defensa ${posiciones["b-def-7"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-7")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-7"]}
                  onDragStart={(e) =>
                    posiciones["b-def-7"] &&
                    handleDragStart(e, posiciones["b-def-7"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-7"]
                        ? posiciones["b-def-7"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-7"]
                        ? posiciones["b-def-7"].nombre_usuario
                        : "DFCD"}
                    </div>
                  </div>
                </div>

                <div
                  className={`defensa dfc-2 ${posiciones["b-def-8"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-8")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-8"]}
                  onDragStart={(e) =>
                    posiciones["b-def-8"] &&
                    handleDragStart(e, posiciones["b-def-8"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-8"]
                        ? posiciones["b-def-8"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-8"]
                        ? posiciones["b-def-8"].nombre_usuario
                        : "DFC"}
                    </div>
                  </div>
                </div>

                <div
                  className={`defensa ${posiciones["b-def-9"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-9")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-9"]}
                  onDragStart={(e) =>
                    posiciones["b-def-9"] &&
                    handleDragStart(e, posiciones["b-def-9"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-9"]
                        ? posiciones["b-def-9"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-9"]
                        ? posiciones["b-def-9"].nombre_usuario
                        : "DFCI"}
                    </div>
                  </div>
                </div>

                <div
                  className={`defensa lateral-izquierdo-2 ${posiciones["b-def-10"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-10")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-10"]}
                  onDragStart={(e) =>
                    posiciones["b-def-10"] &&
                    handleDragStart(e, posiciones["b-def-10"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-10"]
                        ? posiciones["b-def-10"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-10"]
                        ? posiciones["b-def-10"].nombre_usuario
                        : "LI"}
                    </div>
                  </div>
                </div>
              </div>
              {/***********************Defensa************************************************** */}

              {/***********************Pivotes************************************************** */}
              <div className="zona-pivotes">
                <div
                  className={`pivotes pd-2 ${posiciones["b-piv-4"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-piv-4")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-piv-4"]}
                  onDragStart={(e) =>
                    posiciones["b-piv-4"] &&
                    handleDragStart(e, posiciones["b-piv-4"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-piv-4"]
                        ? posiciones["b-piv-4"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-piv-4"]
                        ? posiciones["b-piv-4"].nombre_usuario
                        : "PD"}
                    </div>
                  </div>
                </div>

                <div
                  className={`pivotes pc-2 ${posiciones["b-piv-5"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-piv-5")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-piv-5"]}
                  onDragStart={(e) =>
                    posiciones["b-piv-5"] &&
                    handleDragStart(e, posiciones["b-piv-5"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-piv-5"]
                        ? posiciones["b-piv-5"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-piv-5"]
                        ? posiciones["b-piv-5"].nombre_usuario
                        : "PC"}
                    </div>
                  </div>
                </div>

                <div
                  className={`pivotes pi-2 ${posiciones["b-piv-6"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-piv-6")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-piv-6"]}
                  onDragStart={(e) =>
                    posiciones["b-piv-6"] &&
                    handleDragStart(e, posiciones["b-piv-6"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-piv-6"]
                        ? posiciones["b-piv-6"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-piv-6"]
                        ? posiciones["b-piv-6"].nombre_usuario
                        : "PI"}
                    </div>
                  </div>
                </div>
              </div>
              {/***********************Pivotes************************************************** */}

              {/*************************Mediocampista***********************************************/}
              <div className="zona-mediocampo">
                <div
                  className={`mediocampo mcd-2 ${posiciones["b-med-4"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-med-4")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-med-4"]}
                  onDragStart={(e) =>
                    posiciones["b-med-4"] &&
                    handleDragStart(e, posiciones["b-med-4"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-med-4"]
                        ? posiciones["b-med-4"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-med-4"]
                        ? posiciones["b-med-4"].nombre_usuario
                        : "MCD"}
                    </div>
                  </div>
                </div>

                <div
                  className={`mediocampo mcc ${posiciones["b-med-5"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-med-5")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-med-5"]}
                  onDragStart={(e) =>
                    posiciones["b-med-5"] &&
                    handleDragStart(e, posiciones["b-med-5"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-med-5"]
                        ? posiciones["b-med-5"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-med-5"]
                        ? posiciones["b-med-5"].nombre_usuario
                        : "MCC"}
                    </div>
                  </div>
                </div>

                <div
                  className={`mediocampo mci-2 ${posiciones["b-med-6"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-med-6")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-med-6"]}
                  onDragStart={(e) =>
                    posiciones["b-med-6"] &&
                    handleDragStart(e, posiciones["b-med-6"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-med-6"]
                        ? posiciones["b-med-6"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-med-6"]
                        ? posiciones["b-med-6"].nombre_usuario
                        : "MCI"}
                    </div>
                  </div>
                </div>
              </div>
              {/*************************Mediocampista********************************************/}

              {/*************************Delanteros***********************************************/}
              <div className="zona-delanteros">
                <div
                  className={`delantero delantero-der-2 ${posiciones["b-del-7"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-del-7")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-del-7"]}
                  onDragStart={(e) =>
                    posiciones["b-del-7"] &&
                    handleDragStart(e, posiciones["b-del-7"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-del-7"]
                        ? posiciones["b-del-7"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-del-7"]
                        ? posiciones["b-del-7"].nombre_usuario
                        : "ED"}
                    </div>
                  </div>
                </div>

                <div
                  className={`delantero delantero-centro ${posiciones["b-del-8"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-del-8")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-del-8"]}
                  onDragStart={(e) =>
                    posiciones["b-del-8"] &&
                    handleDragStart(e, posiciones["b-del-8"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-del-8"]
                        ? posiciones["b-del-8"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-del-8"]
                        ? posiciones["b-del-8"].nombre_usuario
                        : "DD"}
                    </div>
                  </div>
                </div>

                <div className="delantero-centro-doble">
                  <div
                    className={`delantero delantero-centro ${posiciones["b-del-9"] ? "ocupado" : ""}`}
                    onDrop={(e) => handleDrop(e, "b-del-9")}
                    onDragOver={handleDragOver}
                    draggable={!!posiciones["b-del-9"]}
                    onDragStart={(e) =>
                      posiciones["b-del-9"] &&
                      handleDragStart(e, posiciones["b-del-9"])
                    }
                  >
                    <div className="cajita">
                      <div className="n-camiseta">
                        {posiciones["b-del-9"]
                          ? posiciones["b-del-9"].numero_camiseta
                          : ""}
                      </div>

                      <div>
                        {posiciones["b-del-9"]
                          ? posiciones["b-del-9"].nombre_usuario
                          : "DC"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`delantero delantero-centro ${posiciones["b-del-10"] ? "ocupado" : ""}`}
                    onDrop={(e) => handleDrop(e, "b-del-10")}
                    onDragOver={handleDragOver}
                    draggable={!!posiciones["b-del-10"]}
                    onDragStart={(e) =>
                      posiciones["b-del-10"] &&
                      handleDragStart(e, posiciones["b-del-10"])
                    }
                  >
                    <div className="cajita">
                      <div className="n-camiseta">
                        {posiciones["b-del-10"]
                          ? posiciones["b-del-10"].numero_camiseta
                          : ""}
                      </div>

                      <div>
                        {posiciones["b-del-10"]
                          ? posiciones["b-del-10"].nombre_usuario
                          : "DC"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`delantero delantero-centro ${posiciones["b-del-11"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-del-11")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-del-11"]}
                  onDragStart={(e) =>
                    posiciones["b-del-11"] &&
                    handleDragStart(e, posiciones["b-del-11"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-del-11"]
                        ? posiciones["b-del-11"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-del-11"]
                        ? posiciones["b-del-11"].nombre_usuario
                        : "DI"}
                    </div>
                  </div>
                </div>

                <div
                  className={`delantero delantero-izq-2 ${posiciones["b-del-12"] ? "ocupado" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-del-12")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-del-12"]}
                  onDragStart={(e) =>
                    posiciones["b-del-12"] &&
                    handleDragStart(e, posiciones["b-del-12"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-del-12"]
                        ? posiciones["b-del-12"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-del-12"]
                        ? posiciones["b-del-12"].nombre_usuario
                        : "EI"}
                    </div>
                  </div>
                </div>
              </div>
              {/*************************Delanteros***********************************************/}
            </div>

            {/* EQUIPO B */}
            <div className="mitad">
              {/*************************Delanteros***********************************************/}
              <div className="zona-delanteros">
                <div
                  className={`delantero delantero-der ${posiciones["b-del-1"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-del-1")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-del-1"]}
                  onDragStart={(e) =>
                    posiciones["b-del-1"] &&
                    handleDragStart(e, posiciones["b-del-1"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-del-1"]
                        ? posiciones["b-del-1"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-del-1"]
                        ? posiciones["b-del-1"].nombre_usuario
                        : "ED"}
                    </div>
                  </div>
                </div>

                <div
                  className={`delantero delantero-centro ${posiciones["b-del-2"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-del-2")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-del-2"]}
                  onDragStart={(e) =>
                    posiciones["b-del-2"] &&
                    handleDragStart(e, posiciones["b-del-2"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-del-2"]
                        ? posiciones["b-del-2"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-del-2"]
                        ? posiciones["b-del-2"].nombre_usuario
                        : "DD"}
                    </div>
                  </div>
                </div>

                <div className="delantero-centro-doble">
                  <div
                    className={`delantero delantero-centro ${posiciones["b-del-3"] ? "ocupado-2" : ""}`}
                    onDrop={(e) => handleDrop(e, "b-del-3")}
                    onDragOver={handleDragOver}
                    draggable={!!posiciones["b-del-3"]}
                    onDragStart={(e) =>
                      posiciones["b-del-3"] &&
                      handleDragStart(e, posiciones["b-del-3"])
                    }
                  >
                    <div className="cajita">
                      <div className="n-camiseta">
                        {posiciones["b-del-3"]
                          ? posiciones["b-del-3"].numero_camiseta
                          : ""}
                      </div>

                      <div>
                        {posiciones["b-del-3"]
                          ? posiciones["b-del-3"].nombre_usuario
                          : "DC"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`delantero delantero-centro ${posiciones["b-del-4"] ? "ocupado-2" : ""}`}
                    onDrop={(e) => handleDrop(e, "b-del-4")}
                    onDragOver={handleDragOver}
                    draggable={!!posiciones["b-del-4"]}
                    onDragStart={(e) =>
                      posiciones["b-del-4"] &&
                      handleDragStart(e, posiciones["b-del-4"])
                    }
                  >
                    <div className="cajita">
                      <div className="n-camiseta">
                        {posiciones["b-del-4"]
                          ? posiciones["b-del-4"].numero_camiseta
                          : ""}
                      </div>

                      <div>
                        {posiciones["b-del-4"]
                          ? posiciones["b-del-4"].nombre_usuario
                          : "DC"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`delantero delantero-centro ${posiciones["b-del-5"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-del-5")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-del-5"]}
                  onDragStart={(e) =>
                    posiciones["b-del-5"] &&
                    handleDragStart(e, posiciones["b-del-5"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-del-5"]
                        ? posiciones["b-del-5"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-del-5"]
                        ? posiciones["b-del-5"].nombre_usuario
                        : "DI"}
                    </div>
                  </div>
                </div>

                <div
                  className={`delantero delantero-izq ${posiciones["b-del-6"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-del-6")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-del-6"]}
                  onDragStart={(e) =>
                    posiciones["b-del-6"] &&
                    handleDragStart(e, posiciones["b-del-6"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-del-6"]
                        ? posiciones["b-del-6"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-del-6"]
                        ? posiciones["b-del-6"].nombre_usuario
                        : "EI"}
                    </div>
                  </div>
                </div>
              </div>
              {/*************************Delanteros***********************************************/}

              {/*************************Mediocampista***********************************************/}
              <div className="zona-mediocampo">
                <div
                  className={`mediocampo mcd ${posiciones["b-med-1"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-med-1")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-med-1"]}
                  onDragStart={(e) =>
                    posiciones["b-med-1"] &&
                    handleDragStart(e, posiciones["b-med-1"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-med-1"]
                        ? posiciones["b-med-1"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-med-1"]
                        ? posiciones["b-med-1"].nombre_usuario
                        : "MCD"}
                    </div>
                  </div>
                </div>

                <div
                  className={`mediocampo mcc ${posiciones["b-med-2"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-med-2")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-med-2"]}
                  onDragStart={(e) =>
                    posiciones["b-med-2"] &&
                    handleDragStart(e, posiciones["b-med-2"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-med-2"]
                        ? posiciones["b-med-2"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-med-2"]
                        ? posiciones["b-med-2"].nombre_usuario
                        : "MCC"}
                    </div>
                  </div>
                </div>

                <div
                  className={`mediocampo mci ${posiciones["b-med-3"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-med-3")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-med-3"]}
                  onDragStart={(e) =>
                    posiciones["b-med-3"] &&
                    handleDragStart(e, posiciones["b-med-3"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-med-3"]
                        ? posiciones["b-med-3"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-med-3"]
                        ? posiciones["b-med-3"].nombre_usuario
                        : "MCI"}
                    </div>
                  </div>
                </div>
              </div>
              {/*************************Mediocampista********************************************/}

              {/***********************Pivotes************************************************** */}
              <div className="zona-pivotes">
                <div
                  className={`pivotes pd ${posiciones["b-piv-1"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-piv-1")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-piv-1"]}
                  onDragStart={(e) =>
                    posiciones["b-piv-1"] &&
                    handleDragStart(e, posiciones["b-piv-1"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-piv-1"]
                        ? posiciones["b-piv-1"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-piv-1"]
                        ? posiciones["b-piv-1"].nombre_usuario
                        : "PD"}
                    </div>
                  </div>
                </div>

                <div
                  className={`pivotes pc ${posiciones["b-piv-2"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-piv-2")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-piv-2"]}
                  onDragStart={(e) =>
                    posiciones["b-piv-2"] &&
                    handleDragStart(e, posiciones["b-piv-2"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-piv-2"]
                        ? posiciones["b-piv-2"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-piv-2"]
                        ? posiciones["b-piv-2"].nombre_usuario
                        : "PC"}
                    </div>
                  </div>
                </div>

                <div
                  className={`pivotes pi ${posiciones["b-piv-3"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-piv-3")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-piv-3"]}
                  onDragStart={(e) =>
                    posiciones["b-piv-3"] &&
                    handleDragStart(e, posiciones["b-piv-3"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-piv-3"]
                        ? posiciones["b-piv-3"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-piv-3"]
                        ? posiciones["b-piv-3"].nombre_usuario
                        : "PI"}
                    </div>
                  </div>
                </div>
              </div>
              {/***********************Pivotes************************************************** */}

              {/***********************Defensa************************************************** */}
              <div className="zona-defensa">
                <div
                  className={`defensa lateral-derecho ${posiciones["b-def-1"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-1")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-1"]}
                  onDragStart={(e) =>
                    posiciones["b-def-1"] &&
                    handleDragStart(e, posiciones["b-def-1"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-1"]
                        ? posiciones["b-def-1"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-1"]
                        ? posiciones["b-def-1"].nombre_usuario
                        : "LD"}
                    </div>
                  </div>
                </div>

                <div
                  className={`defensa ${posiciones["b-def-2"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-2")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-2"]}
                  onDragStart={(e) =>
                    posiciones["b-def-2"] &&
                    handleDragStart(e, posiciones["b-def-2"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-2"]
                        ? posiciones["b-def-2"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-2"]
                        ? posiciones["b-def-2"].nombre_usuario
                        : "DFCD"}
                    </div>
                  </div>
                </div>

                <div
                  className={`defensa dfc ${posiciones["b-def-3"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-3")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-3"]}
                  onDragStart={(e) =>
                    posiciones["b-def-3"] &&
                    handleDragStart(e, posiciones["b-def-3"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-3"]
                        ? posiciones["b-def-3"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-3"]
                        ? posiciones["b-def-3"].nombre_usuario
                        : "DFC"}
                    </div>
                  </div>
                </div>

                <div
                  className={`defensa ${posiciones["b-def-4"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-4")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-4"]}
                  onDragStart={(e) =>
                    posiciones["b-def-4"] &&
                    handleDragStart(e, posiciones["b-def-4"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-4"]
                        ? posiciones["b-def-4"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-4"]
                        ? posiciones["b-def-4"].nombre_usuario
                        : "DFCI"}
                    </div>
                  </div>
                </div>

                <div
                  className={`defensa lateral-izquierdo ${posiciones["b-def-5"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-def-5")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-def-5"]}
                  onDragStart={(e) =>
                    posiciones["b-def-5"] &&
                    handleDragStart(e, posiciones["b-def-5"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-def-5"]
                        ? posiciones["b-def-5"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-def-5"]
                        ? posiciones["b-def-5"].nombre_usuario
                        : "LI"}
                    </div>
                  </div>
                </div>
              </div>
              {/***********************Defensa************************************************** */}
              <div className="zona-portero">
                <div
                  className={`portero ${posiciones["b-por-1"] ? "ocupado-2" : ""}`}
                  onDrop={(e) => handleDrop(e, "b-por-1")}
                  onDragOver={handleDragOver}
                  draggable={!!posiciones["b-por-1"]}
                  onDragStart={(e) =>
                    posiciones["b-por-1"] &&
                    handleDragStart(e, posiciones["b-por-1"])
                  }
                >
                  <div className="cajita">
                    <div className="n-camiseta">
                      {posiciones["b-por-1"]
                        ? posiciones["b-por-1"].numero_camiseta
                        : ""}
                    </div>

                    <div>
                      {posiciones["b-por-1"]
                        ? posiciones["b-por-1"].nombre_usuario
                        : "POR"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="banca">
            <h3>{equipoActivo === "A" ? equipoA.nombre : equipoB.nombre}</h3>

            <div className="lista-jugadores">
              {(equipoActivo === "A" ? equipoA.banca : equipoB.banca).map(
                (jugador) => (
                  <div
                    key={jugador.id_jugador}
                    className="jugador-banca"
                    draggable
                    onDragStart={(e) => handleDragStart(e, jugador)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="numero">{jugador.numero_camiseta} -</span>{" "}
                    {jugador.nombre_usuario} {jugador.apellido_usuario}{" "}
                    <span className="pos">- {jugador.posicion}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
