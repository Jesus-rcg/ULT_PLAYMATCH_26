/**
 * ==========================================================
 * MIS INSCRIPCIONES vista del dt 
 
 *
 * DESCRIPCIÓN:
 * El Director Técnico ve, para cada uno de sus equipos, en
 * qué torneos está inscrito y en qué estado va cada solicitud
 * (Pendiente, Inscrito, Cancelado).
 * ==========================================================
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMisEquipos } from "../../SERVICE/equiposService.js";
import { getInscripcionesPorEquipo } from "../../SERVICE/inscripcionesEquipoService.js";
import "../../STILO/estilosPages/inscripcionEquipo/misInscripciones.css";

export default function InscripcionesEquipos() {
  // Guarda la lista final: cada equipo con su arreglo de inscripciones
  const [equiposConInscripciones, setEquiposConInscripciones] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setCargando(true);

      // 1. Traemos los equipos del DT logueado
      const misEquipos = await getMisEquipos();

      // 2. Por cada equipo, traemos sus inscripciones
      //    (usamos Promise.all para hacerlo en paralelo, no uno por uno)
      const resultado = await Promise.all(
        misEquipos.map(async (equipo) => {
          const inscripciones = await getInscripcionesPorEquipo(
            equipo.id_equipo
          );
          return { ...equipo, inscripciones };
        })
      );

      setEquiposConInscripciones(resultado);

    } catch (err) {
      setError("No se pudieron cargar las inscripciones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Le da una clase CSS distinta a cada estado, para que se
  // identifique rápido en pantalla 
  const claseEstado = (estado) => {
    if (estado === "Inscrito") return "estado-inscrito";
    if (estado === "Cancelado") return "estado-cancelado";
    return "estado-pendiente";
  };

  if (cargando) return <p>Cargando inscripciones...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="inscripciones-page">
      <h1>Mis Inscripciones</h1>

      {equiposConInscripciones.length === 0 && (
        <p>Aún no tiene equipos registrados.</p>
      )}

      {equiposConInscripciones.map((equipo) => (
        <div className="equipo-inscripciones-bloque" key={equipo.id_equipo}>
          <div className="equipo-header">
            <img src={equipo.escudo} alt={equipo.nombre_equipo} />
            <h2>{equipo.nombre_equipo}</h2>

            {/* Botón para inscribir este equipo a un nuevo torneo */}
            <Link to={`/inscripcionEquipos/crear/${equipo.id_equipo}`}>
              + Inscribir a un torneo
            </Link>
          </div>

          {/* RF-006.2 - FA-01: Sin inscripciones */}
          {equipo.inscripciones.length === 0 && (
            <p>Aún no hay inscripciones para este equipo.</p>
          )}

          <table className="tabla-inscripciones">
            <thead>
              <tr>
                <th>Torneo</th>
                <th>Fecha de inscripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipo.inscripciones.map((ins) => (
                <tr key={ins.id_inscripcion_e}>
                  <td>{ins.nombre_torneo}</td>
                  <td>
                    {new Date(ins.fecha_ins_equipo).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={claseEstado(ins.estado)}>
                      {ins.estado}
                    </span>
                  </td>
                  <td>
                    {/* Solo se puede retirar mientras está Pendiente */}
                    {ins.estado === "Pendiente" && (
                      <Link
                        to={`/inscripcionEquipos/eliminar/${ins.id_inscripcion_e}`}
                      >
                        Retirar solicitud
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}