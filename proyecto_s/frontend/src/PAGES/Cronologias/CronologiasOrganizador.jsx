import { useEffect, useState } from "react";
import {
  getAlineacionesEquipoRequest,
  getAlineacionRequest,
} from "../../SERVICE/alineacionService";
import {
  getEncuentroDetalle,
  createCronologia,
  updateCronologia,
  getCronologias,
} from "../../SERVICE/cronologiasService";
import { getResultadoByEncuentro } from "../../SERVICE/resultadosService";
import { useParams } from "react-router-dom";
import PosicionCampo from "../Alineacion/PosicionCampo";
import "../../STILO/estilosPages/cronologias/cronologias.css";

import escudoA from "../../ASSETS/escudo 1.jpg";
import escudoB from "../../ASSETS/escudo 2.jpg";
import campo from "../../ASSETS/campo12.png";

export default function CronologiasOrganizador() {
  const { id } = useParams();

  const [encuentro, setEncuentro] = useState(null);
  const [posiciones, setPosiciones] = useState({});

  const [segundos, setSegundos] = useState(0);
  const [cronometroActivo, setCronometroActivo] = useState(false);

  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  const equipoLocal = encuentro?.equipo_local || "Equipo Local";
  const equipoVisitante = encuentro?.equipo_visitante || "Equipo Visitante";

  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

  const [tipoEvento, setTipoEvento] = useState("");

  const [posicionSeleccionada, setPosicionSeleccionada] = useState(null);

  const [modalEvento, setModalEvento] = useState(null);
  const [eventoFinal, setEventoFinal] = useState(null);

  const [cronologias, setCronologias] = useState([]);

  const [resultado, setResultado] = useState({
    goles_local: 0,
    goles_visitante: 0,
  });

  const posicionesPorJugador = Object.values(posiciones).reduce(
    (acc, jugador) => {
      acc[jugador.id_jugador] = jugador;
      return acc;
    },
    {},
  );

  const cargarResultado = async () => {
    try {
      const data = await getResultadoByEncuentro(id);
      setResultado(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarCronologias = async () => {
    const data = await getCronologias();

    const filtradas = data
      .filter((c) => Number(c.id_encuentro) === Number(id))
      .reduce((acc, item) => {
        const existe = acc.find((x) => x.id_cronologia === item.id_cronologia);
        if (!existe) acc.push(item);
        return acc;
      }, []);

    setCronologias(filtradas);
  };

  const obtenerEstadisticasJugador = (idJugador) => {
    if (!idJugador) return { goles: 0, amarillas: 0, rojas: 0 };

    const eventos = cronologias.filter(
      (c) => Number(c.id_jugador) === Number(idJugador),
    );

    return {
      goles: eventos.filter((e) => e.evento === "Gol").length,
      amarillas: eventos.filter((e) => e.evento === "Amarilla").length,
      rojas: eventos.filter((e) => e.evento === "Roja").length,
    };
  };

  const handleSeleccionarJugador = (posicion) => {
    if (!posiciones[posicion]) return;

    setPosicionSeleccionada((prev) => (prev === posicion ? null : posicion));
  };

  const renderBotonesEvento = (posicion) => {
    if (posicionSeleccionada !== posicion) return null;

    return (
      <>
        <button
          className="btn-evento gol"
          onClick={(e) => {
            e.stopPropagation();

            if (!cronometroActivo) {
              alert("Debes iniciar el cronómetro para registrar un evento.");
              return;
            }

            setJugadorSeleccionado(posiciones[posicion]);
            setModalEvento("gol");
          }}
        >
          ⚽
        </button>

        <button
          className="btn-evento amarilla"
          onClick={(e) => {
            e.stopPropagation();

            if (!cronometroActivo) {
              alert("Debes iniciar el cronómetro para registrar un evento.");
              return;
            }

            setJugadorSeleccionado(posiciones[posicion]);
            setModalEvento("amarilla");
          }}
        >
          🟨
        </button>
      </>
    );
  };

  const cargarEncuentro = async () => {
    try {
      const data = await getEncuentroDetalle(id);
      setEncuentro(data);
    } catch (error) {
      console.error(error);
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
    if (id) {
      cargarEncuentro();
    }
  }, [id]);

  useEffect(() => {
    if (encuentro) {
      cargarAlineaciones();
    }
  }, [encuentro]);

  useEffect(() => {
    cargarCronologias();
  }, [id]);

  useEffect(() => {
    if (id) {
      cargarResultado();
    }
  }, [id]);

  useEffect(() => {
    let intervalo;

    if (cronometroActivo) {
      intervalo = setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalo);
  }, [cronometroActivo]);

  const guardarEvento = async (eventoFinal) => {
    if (!jugadorSeleccionado || !eventoFinal) return;

    try {
      await createCronologia({
        id_encuentro: id,
        id_jugador: jugadorSeleccionado.id_jugador,
        evento: eventoFinal,
        minuto: Math.floor(segundos / 60),
      });

      await cargarCronologias();

      await recalcularResultado(id);

      await cargarResultado();

      setModalEvento(null);
      setJugadorSeleccionado(null);
      setPosicionSeleccionada(null);
    } catch (error) {
      console.error(error);
    }
  };

  const anularUltimoGol = async () => {
    const data = await getCronologias();

    const ultimoGol = data
      .filter(
        (c) =>
          Number(c.id_encuentro) === Number(id) &&
          c.id_jugador === jugadorSeleccionado?.id_jugador &&
          c.evento === "Gol",
      )
      .sort((a, b) => b.id_cronologia - a.id_cronologia)[0];

    if (!ultimoGol) return;

    await updateCronologia(ultimoGol.id_cronologia, {
      evento: "Gol Anulado",
    });

    await cargarCronologias();
    await recalcularResultado(id);
    await cargarResultado();
  };

  const anularUltimaTarjeta = async (tipoTarjeta) => {
    if (!tipoTarjeta || !jugadorSeleccionado) return;

    const data = await getCronologias();

    const ultimaTarjeta = data
      .filter(
        (c) =>
          Number(c.id_encuentro) === Number(id) &&
          c.id_jugador === jugadorSeleccionado.id_jugador &&
          c.evento === tipoTarjeta,
      )
      .sort((a, b) => b.id_cronologia - a.id_cronologia)[0];

    if (!ultimaTarjeta) return;

    await updateCronologia(ultimaTarjeta.id_cronologia, {
      evento: "Tarjeta Anulada",
    });

    await cargarCronologias();
    await recalcularResultado(id);
    await cargarResultado();
  };

  const recalcularResultado = async (idEncuentro) => {
    const data = await getCronologias();

    const eventosGol = data.filter(
      (c) =>
        Number(c.id_encuentro) === Number(idEncuentro) && c.evento === "Gol",
    );

    const golesLocal = eventosGol.filter(
      (e) => posicionesPorJugador[e.id_jugador]?.equipo === "A",
    ).length;

    const golesVisitante = eventosGol.filter(
      (e) => posicionesPorJugador[e.id_jugador]?.equipo === "B",
    ).length;

    try {
      // ¿Existe el resultado?
      await getResultadoByEncuentro(idEncuentro);

      // Sí existe → actualizar
      await fetch(
        `${import.meta.env.VITE_API_URL}/resultados/encuentro/${idEncuentro}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goles_local: golesLocal,
            goles_visitante: golesVisitante,
          }),
        },
      );
    } catch (error) {
      // No existe → crear
      await fetch(`${import.meta.env.VITE_API_URL}/resultados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_encuentro: idEncuentro,
          goles_local: golesLocal,
          goles_visitante: golesVisitante,
        }),
      });
    }

    await cargarResultado();
  };

  return (
    <div className="contenedor">
      <div className="bloques">
        <div className="container-cancha-banca">
          <div>
            <div className="contenedor-cancha">
              <div className="escudo">
                <img src={escudoA} alt="Equipo Local" />
                <h3>{equipoLocal}</h3>
                <h2>{resultado.goles_local}</h2>
              </div>
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
                      soloLectura={true}
                      handleSeleccionarJugador={handleSeleccionarJugador}
                      renderBotonesEvento={renderBotonesEvento}
                      obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                    />
                  </div>

                  <div className="zona-defensa">
                    <div className="lateral-derecho-2">
                      <PosicionCampo
                        id="a-def-1"
                        clase="defensa"
                        abreviatura="LD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc-3">
                      <PosicionCampo
                        id="a-def-2"
                        clase="defensa"
                        abreviatura="DFCD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc-3 dfc-2">
                      <PosicionCampo
                        id="a-def-3"
                        clase="defensa"
                        abreviatura="DFC"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc-3">
                      <PosicionCampo
                        id="a-def-4"
                        clase="defensa"
                        abreviatura="DFCI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="lateral-izquierdo-2">
                      <PosicionCampo
                        id="a-def-5"
                        clase="defensa"
                        abreviatura="LI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-pivotes">
                    <div className="pd-2">
                      <PosicionCampo
                        id="a-piv-1"
                        clase="pivotes"
                        abreviatura="PD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="pc-2">
                      <PosicionCampo
                        id="a-piv-2"
                        clase="pivotes"
                        abreviatura="PC"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="pi-2">
                      <PosicionCampo
                        id="a-piv-3"
                        clase="pivotes"
                        abreviatura="PI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-mediocampista">
                    <div className="mcd-2">
                      <PosicionCampo
                        id="a-med-1"
                        clase="mediocampista"
                        abreviatura="MCD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="mcc-2">
                      <PosicionCampo
                        id="a-med-2"
                        clase="mediocampista"
                        abreviatura="MCC"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="mci-2">
                      <PosicionCampo
                        id="a-med-3"
                        clase="mediocampista"
                        abreviatura="MCI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
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
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-centro">
                      <PosicionCampo
                        id="a-del-2"
                        clase="delantero"
                        abreviatura="DCD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
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
                          soloLectura={true}
                          handleSeleccionarJugador={handleSeleccionarJugador}
                          renderBotonesEvento={renderBotonesEvento}
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
                          soloLectura={true}
                          handleSeleccionarJugador={handleSeleccionarJugador}
                          renderBotonesEvento={renderBotonesEvento}
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
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-izq-2">
                      <PosicionCampo
                        id="a-del-6"
                        clase="delantero"
                        abreviatura="EI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>
                </div>

                {/* EQUIPO B */}
                <div className="mitad visitante">
                  <div className="zona-delanteros">
                    <div className="delantero-der ocupado-2">
                      <PosicionCampo
                        id="b-del-1"
                        clase="delantero"
                        abreviatura="ED"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-centro">
                      <PosicionCampo
                        id="b-del-2"
                        clase="delantero"
                        abreviatura="DCD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
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
                          soloLectura={true}
                          handleSeleccionarJugador={handleSeleccionarJugador}
                          renderBotonesEvento={renderBotonesEvento}
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
                          soloLectura={true}
                          handleSeleccionarJugador={handleSeleccionarJugador}
                          renderBotonesEvento={renderBotonesEvento}
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
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="delantero-izq">
                      <PosicionCampo
                        id="b-del-6"
                        clase="delantero"
                        abreviatura="EI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-mediocampista">
                    <div className="mcd">
                      <PosicionCampo
                        id="b-med-1"
                        clase="mediocampista"
                        abreviatura="MCD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="mcc">
                      <PosicionCampo
                        id="b-med-2"
                        clase="mediocampista"
                        abreviatura="MCC"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="mci">
                      <PosicionCampo
                        id="b-med-3"
                        clase="mediocampista"
                        abreviatura="MCI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-pivotes">
                    <div className="pd">
                      <PosicionCampo
                        id="b-piv-1"
                        clase="pivotes"
                        abreviatura="PD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="pc">
                      <PosicionCampo
                        id="b-piv-2"
                        clase="pivotes"
                        abreviatura="PC"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="pi">
                      <PosicionCampo
                        id="b-piv-3"
                        clase="pivotes"
                        abreviatura="PI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-defensa">
                    <div className="lateral-derecho">
                      <PosicionCampo
                        id="b-def-1"
                        clase="defensa"
                        abreviatura="LD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc">
                      <PosicionCampo
                        id="b-def-2"
                        clase="defensa"
                        abreviatura="DFCD"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc dfc">
                      <PosicionCampo
                        id="b-def-3"
                        clase="defensa"
                        abreviatura="DFC"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="dfc">
                      <PosicionCampo
                        id="b-def-4"
                        clase="defensa"
                        abreviatura="DFCI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>

                    <div className="lateral-izquierdo">
                      <PosicionCampo
                        id="b-def-5"
                        clase="defensa"
                        abreviatura="LI"
                        posiciones={posiciones}
                        soloLectura={true}
                        handleSeleccionarJugador={handleSeleccionarJugador}
                        renderBotonesEvento={renderBotonesEvento}
                        obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                      />
                    </div>
                  </div>

                  <div className="zona-portero">
                    <PosicionCampo
                      id="b-por-1"
                      clase="portero"
                      abreviatura="POR"
                      posiciones={posiciones}
                      soloLectura={true}
                      handleSeleccionarJugador={handleSeleccionarJugador}
                      renderBotonesEvento={renderBotonesEvento}
                      obtenerEstadisticasJugador={obtenerEstadisticasJugador}
                    />
                  </div>
                </div>
              </div>
              <div className="escudo">
                <img src={escudoB} alt="Equipo Visitante" />
                <h3>{equipoVisitante}</h3>
                <h2>{resultado.goles_visitante}</h2>
              </div>
            </div>
            <div>
              <div className="cronometro">
                {String(minutos).padStart(2, "0")}:
                {String(segundosRestantes).padStart(2, "0")}
              </div>
            </div>
            <div className="controles-cronometro">
              <button onClick={() => setCronometroActivo(true)}>
                ▶ Iniciar
              </button>

              <button onClick={() => setCronometroActivo(false)}>
                ⏸ Pausar
              </button>

              <button
                onClick={() => {
                  setCronometroActivo(false);
                  setSegundos(0);
                }}
              >
                ⏹ Reiniciar
              </button>

              {modalEvento && (
                <div className="modal-evento">
                  <div className="modal-contenido">
                    <h3>Selecciona el tipo de evento</h3>

                    {modalEvento === "gol" && (
                      <>
                        <button
                          onClick={() => {
                            setEventoFinal("Gol");
                            guardarEvento("Gol");
                          }}
                        >
                          ⚽ Gol válido
                        </button>

                        <button
                          onClick={() => {
                            anularUltimoGol();
                          }}
                        >
                          ❌ Gol anulado
                        </button>
                      </>
                    )}

                    {modalEvento === "amarilla" && (
                      <>
                        <button onClick={() => guardarEvento("Amarilla")}>
                          🟨 Amarilla
                        </button>

                        <button onClick={() => guardarEvento("Roja")}>
                          🟥 Roja
                        </button>

                        <button
                          onClick={() => {
                            anularUltimaTarjeta("Amarilla");
                          }}
                        >
                          ❌ Anular Amarilla
                        </button>

                        <button
                          onClick={() => {
                            anularUltimaTarjeta("Roja");
                          }}
                        >
                          ❌ Anular Roja
                        </button>
                      </>
                    )}

                    <button onClick={() => setModalEvento(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
