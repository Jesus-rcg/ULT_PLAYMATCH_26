import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCronologias,
  getEncuentroDetalle,
  getJugadoresByEquipo,
} from "../../SERVICE/cronologiasService";
import {
  guardarAlineacionRequest,
  getAlineacionesEquipoRequest,
  getAlineacionRequest,
} from "../../SERVICE/alineacionService";
import Encuentros from "../Encuentros/Encuentros";
import { useParams } from "react-router-dom";
import PosicionCampo from "./PosicionCampo";
import "../../STILO/estilosPages/alineacion/alineacion.css";

import escudoA from "../../ASSETS/escudo.jpg";
import escudoB from "../../ASSETS/escudo.jpg";
import campo from "../../ASSETS/campo12.png";

export default function Alineacion() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [cronologias, setCronologias] = useState([]);
  const [encuentro, setEncuentro] = useState(null);

  const [equipoActivo, setEquipoActivo] = useState("A");
  const [posiciones, setPosiciones] = useState({});

  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);

  const equipoLocal = encuentro?.equipo_local || "Equipo Local";
  const equipoVisitante = encuentro?.equipo_visitante || "Equipo Visitante";

  const [posicionSeleccionada, setPosicionSeleccionada] = useState(null);

  const [mostrarBanca, setMostrarBanca] = useState(null);

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

      setJugadoresLocal(
        jugadoresLocalData.map((jugador) => ({
          ...jugador,
          equipo: "A",
        })),
      );

      setJugadoresVisitante(
        jugadoresVisitanteData.map((jugador) => ({
          ...jugador,
          equipo: "B",
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const guardarAlineacion = async (equipo) => {
    try {
      const id_equipo =
        equipo === "A"
          ? encuentro.id_equipo_local
          : encuentro.id_equipo_visitante;

      const jugadores = Object.entries(posiciones)
        .filter(([posicion]) =>
          equipo === "A"
            ? posicion.startsWith("a-")
            : posicion.startsWith("b-"),
        )
        .map(([posicion, jugador]) => ({
          id_jugador: jugador.id_jugador,
          posicion,
        }));

      if (jugadores.length !== 11) {
        alert("Debes colocar los 11 jugadores.");
        return;
      }

      await guardarAlineacionRequest({
        id_equipo,
        nombre: `Alineación ${new Date().toLocaleString()}`,
        activa: 1,
        jugadores,
      });

      alert("Alineación guardada.");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la alineación.");
    }
  };

  const cargarAlineaciones = async () => {
    try {
      const idLocal = encuentro?.id_equipo_local;
      const idVisitante = encuentro?.id_equipo_visitante;

      if (!idLocal || !idVisitante) return;

      // Obtener lista de alineaciones
      const local = await getAlineacionesEquipoRequest(idLocal);
      const visitante = await getAlineacionesEquipoRequest(idVisitante);

      // Buscar la activa
      const alineacionLocal = local.find((a) => a.activa === 1);
      const alineacionVisitante = visitante.find((a) => a.activa === 1);

      let nuevasPosiciones = {};

      // Obtener detalle de la alineación local
      if (alineacionLocal) {
        const detalleLocal = await getAlineacionRequest(
          alineacionLocal.id_alineacion,
        );

        detalleLocal.jugadores.forEach((j) => {
          nuevasPosiciones[j.posicion] = {
            id_jugador: j.id_jugador,
            nombre_usuario: j.nombre_usuario,
            apellido_usuario: j.apellido_usuario,
            numero_camiseta: j.numero_camiseta,
            equipo: "A",
          };
        });
      }

      // Obtener detalle de la alineación visitante
      if (alineacionVisitante) {
        const detalleVisitante = await getAlineacionRequest(
          alineacionVisitante.id_alineacion,
        );

        detalleVisitante.jugadores.forEach((j) => {
          nuevasPosiciones[j.posicion] = {
            id_jugador: j.id_jugador,
            nombre_usuario: j.nombre_usuario,
            apellido_usuario: j.apellido_usuario,
            numero_camiseta: j.numero_camiseta,
            equipo: "B",
          };
        });
      }

      setPosiciones(nuevasPosiciones);
    } catch (error) {
      console.error("Error cargando alineaciones:", error);
    }
  };

  useEffect(() => {
    cargarCronologias();

    if (id) {
      cargarEncuentro();
    }
  }, [id]);

  useEffect(() => {
    if (encuentro) {
      cargarAlineaciones();
    }
  }, [encuentro]);

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

    // El equipo local solo puede ir a posiciones "a-"
    if (jugador.equipo === "A" && !posicionNueva.startsWith("a-")) {
      return;
    }

    // El equipo visitante solo puede ir a posiciones "b-"
    if (jugador.equipo === "B" && !posicionNueva.startsWith("b-")) {
      return;
    }

    setPosiciones((prev) => {
      const nuevasPosiciones = { ...prev };

      // Verificar si el jugador ya está en el campo
      const jugadorYaEsta = Object.values(nuevasPosiciones).some(
        (j) => j?.id_jugador === jugador.id_jugador,
      );

      // Contar jugadores del mismo equipo en el campo
      const cantidadJugadores = Object.values(nuevasPosiciones).filter(
        (j) => j && j.equipo === jugador.equipo,
      ).length;

      // Si ya hay 11 y el jugador no estaba en el campo, no dejar agregarlo
      if (!jugadorYaEsta && cantidadJugadores >= 11) {
        alert("Solo puedes colocar 11 jugadores por equipo.");
        return prev;
      }

      // Quitar al jugador de su posición anterior
      Object.keys(nuevasPosiciones).forEach((posicion) => {
        if (nuevasPosiciones[posicion]?.id_jugador === jugador.id_jugador) {
          delete nuevasPosiciones[posicion];
        }
      });

      // Colocarlo en la nueva posición
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

  const handleSeleccionarJugador = (posicion) => {
    if (!posiciones[posicion]) return;

    // muestra el boton para quitar el jugador
    setPosicionSeleccionada((prev) => (prev === posicion ? null : posicion));
  };

  const eliminarJugador = () => {
    if (!posicionSeleccionada) return;

    setPosiciones((prev) => {
      const nuevasPosiciones = { ...prev };
      delete nuevasPosiciones[posicionSeleccionada];
      return nuevasPosiciones;
    });

    setPosicionSeleccionada(null);
  };

  const renderBotonEliminar = (posicion) => {
    if (posicionSeleccionada !== posicion) return null;

    return (
      <button
        className="btn-eliminar-jugador"
        onClick={(e) => {
          e.stopPropagation();
          eliminarJugador();
        }}
      >
        X
      </button>
    );
  };

  const obtenerEstadisticasJugador = (idJugador) => {
    return {
      goles: 0,
      amarillas: 0,
      rojas: 0,
    };
  };

  return (
    <div className="contenedor">
      <div className="bloques">
        <div className="marcador">
          <div
            className="escudo"
            onClick={() => {
              setEquipoActivo("A");
              setMostrarBanca((prev) => (prev === "A" ? null : "A"));
            }}
          >
            <img src={escudoA} alt="Equipo Local" />
            <h3>{equipoLocal}</h3>
          </div>

          <div>
            <h1>ALINEACION</h1>
          </div>

          <div
            className="escudo"
            onClick={() => {
              setEquipoActivo("B");
              setMostrarBanca((prev) => (prev === "B" ? null : "B"));
            }}
          >
            <img src={escudoB} alt="Equipo Visitante" />
            <h3>{equipoVisitante}</h3>
          </div>
        </div>

        <div className="container-cancha-banca">
          {mostrarBanca === "A" && (
            <div className="banca local-banca">
              <button
                className="cerrar-banca  btn-cerrar"
                onClick={() => setMostrarBanca(null)}
              >
                <span className="text-banca"> ✕</span>
              </button>

              <h3>{equipoA.nombre}</h3>

              <div className="lista-jugadores">
                {equipoA.banca
                  .filter(
                    (jugador) =>
                      !Object.values(posiciones).some(
                        (j) => j?.id_jugador === jugador.id_jugador,
                      ),
                  )
                  .map((jugador) => (
                    <div
                      key={jugador.id_jugador}
                      className="jugador-banca"
                      draggable
                      onDragStart={(e) => handleDragStart(e, jugador)}
                      onDragEnd={handleDragEnd}
                    >
                      <span className="numero">
                        {jugador.numero_camiseta} -
                      </span>{" "}
                      {jugador.nombre_usuario} {jugador.apellido_usuario}
                      <span className="pos"> - {jugador.posicion}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <div>
            <div className="contenedor-cancha">
              <div
                className="cancha"
                style={{
                  backgroundImage: `url(${campo})`,
                }}
              >
                {/* EQUIPO A */}
                <div className="mitad local">
                  <div className="zona-portero">
                    <PosicionCampo
                      id="a-por-1"
                      clase="portero"
                      abreviatura="POR"
                      posiciones={posiciones}
                      handleDrop={handleDrop}
                      handleDragOver={handleDragOver}
                      handleDragStart={handleDragStart}
                      handleSeleccionarJugador={handleSeleccionarJugador}
                      renderBotonEliminar={renderBotonEliminar}
                      obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                    />
                  </div>

                  <div className="zona-defensa">
                    <div className="lateral-derecho-2">
                      <PosicionCampo
                        id="a-def-1"
                        clase="defensa "
                        abreviatura="LD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc-3">
                      <PosicionCampo
                        id="a-def-2"
                        clase="defensa "
                        abreviatura="DFCD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc-3 dfc-2">
                      <PosicionCampo
                        id="a-def-3"
                        clase="defensa "
                        abreviatura="DFC"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc-3">
                      <PosicionCampo
                        id="a-def-4"
                        clase="defensa "
                        abreviatura="DFCI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="lateral-izquierdo-2">
                      <PosicionCampo
                        id="a-def-5"
                        clase="defensa "
                        abreviatura="LI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-pivotes">
                    <div className="pd-2">
                      <PosicionCampo
                        id="a-piv-1"
                        clase="pivotes "
                        abreviatura="PD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="pc-2 ">
                      <PosicionCampo
                        id="a-piv-2"
                        clase="pivotes "
                        abreviatura="PC"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="pi-2 ">
                      <PosicionCampo
                        id="a-piv-3"
                        clase="pivotes "
                        abreviatura="PI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-mediocampista">
                    <div className="mcd-2">
                      <PosicionCampo
                        id="a-med-1"
                        clase="mediocampista "
                        abreviatura="MCD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="mcc-2">
                      <PosicionCampo
                        id="a-med-2"
                        clase="mediocampista "
                        abreviatura="MCC"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="mci-2">
                      <PosicionCampo
                        id="a-med-3"
                        clase="mediocampista "
                        abreviatura="MCI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-delanteros">
                    <div className="delantero-der-2">
                      <PosicionCampo
                        id="a-del-1"
                        clase="delantero"
                        abreviatura="ED"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-centro">
                      <PosicionCampo
                        id="a-del-2"
                        clase="delantero"
                        abreviatura="DCD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-centro-doble">
                      <div className="elantero-centro">
                        <PosicionCampo
                          id="a-del-3"
                          clase="delantero"
                          abreviatura="DC"
                          posiciones={posiciones}
                          handleDrop={handleDrop}
                          handleDragOver={handleDragOver}
                          handleDragStart={handleDragStart}
                          handleSeleccionarJugador={handleSeleccionarJugador}
                          renderBotonEliminar={renderBotonEliminar}
                          obtenerEstadisticasJugador={
                            obtenerEstadisticasJugador
                          }
                        />
                      </div>

                      <div className="elantero-centro">
                        <PosicionCampo
                          id="a-del-4"
                          clase="delantero"
                          abreviatura="DC"
                          posiciones={posiciones}
                          handleDrop={handleDrop}
                          handleDragOver={handleDragOver}
                          handleDragStart={handleDragStart}
                          handleSeleccionarJugador={handleSeleccionarJugador}
                          renderBotonEliminar={renderBotonEliminar}
                          obtenerEstadisticasJugador={
                            obtenerEstadisticasJugador
                          }
                        />
                      </div>
                    </div>

                    <div className="delantero-centro">
                      <PosicionCampo
                        id="a-del-5"
                        clase="delantero"
                        abreviatura="DCI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-izq-2">
                      <PosicionCampo
                        id="a-del-6"
                        clase="delantero"
                        abreviatura="EI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>
                </div>

                {/* EQUIPO B */}
                <div className="mitad visitante">
                  <div className="zona-portero">
                    <PosicionCampo
                      id="b-por-1"
                      clase="portero"
                      abreviatura="POR"
                      posiciones={posiciones}
                      handleDrop={handleDrop}
                      handleDragOver={handleDragOver}
                      handleDragStart={handleDragStart}
                      handleSeleccionarJugador={handleSeleccionarJugador}
                      renderBotonEliminar={renderBotonEliminar}
                      obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                    />
                  </div>

                  <div className="zona-delanteros">
                    <div className="delantero-der ocupado-2">
                      <PosicionCampo
                        id="b-del-1"
                        clase="delantero "
                        abreviatura="ED"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-centro">
                      <PosicionCampo
                        id="b-del-2"
                        clase="delantero"
                        abreviatura="DCD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-centro-doble">
                      <div className="elantero-centro">
                        <PosicionCampo
                          id="b-del-3"
                          clase="delantero"
                          abreviatura="DC"
                          posiciones={posiciones}
                          handleDrop={handleDrop}
                          handleDragOver={handleDragOver}
                          handleDragStart={handleDragStart}
                          handleSeleccionarJugador={handleSeleccionarJugador}
                          renderBotonEliminar={renderBotonEliminar}
                          obtenerEstadisticasJugador={
                            obtenerEstadisticasJugador
                          }
                        />
                      </div>

                      <div className="elantero-centro">
                        <PosicionCampo
                          id="b-del-4"
                          clase="delantero"
                          abreviatura="DC"
                          posiciones={posiciones}
                          handleDrop={handleDrop}
                          handleDragOver={handleDragOver}
                          handleDragStart={handleDragStart}
                          handleSeleccionarJugador={handleSeleccionarJugador}
                          renderBotonEliminar={renderBotonEliminar}
                          obtenerEstadisticasJugador={
                            obtenerEstadisticasJugador
                          }
                        />
                      </div>
                    </div>

                    <div className="delantero-centro">
                      <PosicionCampo
                        id="b-del-5"
                        clase="delantero"
                        abreviatura="DCI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-izq">
                      <PosicionCampo
                        id="b-del-6"
                        clase="delantero "
                        abreviatura="EI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-mediocampista">
                    <div className="mcd">
                      <PosicionCampo
                        id="b-med-1"
                        clase="mediocampista "
                        abreviatura="MCD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="mcc">
                      <PosicionCampo
                        id="b-med-2"
                        clase="mediocampista "
                        abreviatura="MCC"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="mci">
                      <PosicionCampo
                        id="b-med-3"
                        clase="mediocampista "
                        abreviatura="MCI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-pivotes">
                    <div className="pd">
                      <PosicionCampo
                        id="b-piv-1"
                        clase="pivotes "
                        abreviatura="PD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="pc">
                      <PosicionCampo
                        id="b-piv-2"
                        clase="pivotes  "
                        abreviatura="PC"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="pi">
                      <PosicionCampo
                        id="b-piv-3"
                        clase="pivotes  "
                        abreviatura="PI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-defensa">
                    <div className="lateral-derecho">
                      <PosicionCampo
                        id="b-def-1"
                        clase="defensa "
                        abreviatura="LD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc">
                      <PosicionCampo
                        id="b-def-2"
                        clase="defensa "
                        abreviatura="DFCD"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc dfc">
                      <PosicionCampo
                        id="b-def-3"
                        clase="defensa "
                        abreviatura="DFC"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc">
                      <PosicionCampo
                        id="b-def-4"
                        clase="defensa "
                        abreviatura="DFCI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="lateral-izquierdo">
                      <PosicionCampo
                        id="b-def-5"
                        clase="defensa "
                        abreviatura="LI"
                        posiciones={posiciones}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleDragStart={handleDragStart}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonEliminar={renderBotonEliminar}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-guardar-alineaciones">
              <button
                className="btn-local"
                onClick={() => guardarAlineacion("A")}
              >
                Guardar alineación Local
              </button>

              <button
                className="btn-visitante"
                onClick={() => guardarAlineacion("B")}
              >
                Guardar alineación Visitante
              </button>
            </div>
          </div>
          {mostrarBanca === "B" && (
            <div className="banca visitante-banca">
              <button
                className="cerrar-banca"
                onClick={() => setMostrarBanca(null)}
              >
                ✕
              </button>

              <h3>{equipoB.nombre}</h3>

              <div className="lista-jugadores">
                {equipoB.banca
                  .filter(
                    (jugador) =>
                      !Object.values(posiciones).some(
                        (j) => j?.id_jugador === jugador.id_jugador,
                      ),
                  )
                  .map((jugador) => (
                    <div
                      key={jugador.id_jugador}
                      className="jugador-banca"
                      draggable
                      onDragStart={(e) => handleDragStart(e, jugador)}
                      onDragEnd={handleDragEnd}
                    >
                      <span className="numero">
                        {jugador.numero_camiseta} -
                      </span>{" "}
                      {jugador.nombre_usuario} {jugador.apellido_usuario}
                      <span className="pos"> - {jugador.posicion}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="btn-cronologia"
          onClick={() => navigate(`/cronologias/${encuentro.id_encuentro}`)}
        >
          Ir a Cronologías
        </button>
      </div>
    </div>
  );
}
