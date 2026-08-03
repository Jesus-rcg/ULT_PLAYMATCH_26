/**
 * ==========================================================
 * LISTADO DE EQUIPOS
 *
 *
 * DESCRIPCIÓN:
 * Muestra todos los equipos activos del sistema. Cualquiera puede
 * ver la plantilla de jugadores de un equipo (botón "Ver Jugadores").
 * Si el usuario logueado es el dueño del equipo (o es Administrador),
 * además le aparecen los botones de Editar, Desactivar e Inscribir.
 * ==========================================================
 */

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getEquipos } from "../../SERVICE/equiposService.js";
import { AuthContext } from "../../CONTEXT/AuthContext.jsx";
import { ROLES } from "../../CONSTANTES/roles.js";
import "../../STILO/estilosPages/equipos/equipos.css";
export default function Equipos() {
  // Guardamos la lista de equipos que llega del backend
  const [equipos, setEquipos] = useState([]);

  // Controla el mensaje "Cargando..." mientras llega la info
  const [cargando, setCargando] = useState(true);

  // Guardamos si hubo algún error al consultar
  const [error, setError] = useState("");

  // Filtro de búsqueda por nombre (RF-002.2 - filtro opcional)
  const [busqueda, setBusqueda] = useState("");

  // Traemos el usuario logueado para saber qué botones mostrarle
  const { user } = useContext(AuthContext);

  // Esta función carga los equipos desde el backend
  const cargarEquipos = async () => {
    try {
      setCargando(true);
      const data = await getEquipos();
      setEquipos(data);
    } catch (err) {
      setError("No se pudieron cargar los equipos.");
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta una sola vez, cuando el componente se monta
  useEffect(() => {
    cargarEquipos();
  }, []);

  // Filtramos en el frontend por el texto que el usuario escriba
  const equiposFiltrados = equipos.filter((eq) =>
    eq.nombre_equipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Esta función decide si el usuario logueado puede editar/desactivar
  // el equipo: debe ser el dueño (mismo id_usuario) o Administrador.
  const puedeGestionar = (equipo) => {
    if (!user) return false;
    if (user.rol === ROLES.ADMINISTRADOR) return true;
    return user.id_usuario === equipo.id_usuario;
  };

  return (
    <div className="equipos-page">
      <h1>Equipos</h1>

      {/* Barra superior: buscador + botón crear */}
      <div className="equipos-toolbar">
        <input
          type="text"
          placeholder="Buscar equipo por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* Solo el DT (Entrenador) o Admin pueden crear equipos */}
        {user && (user.rol === ROLES.ENTRENADOR || user.rol === ROLES.ADMINISTRADOR) && (
          <Link to="/equipos/crear" className="btn-crear">
            + Crear Equipo
          </Link>
        )}
      </div>

      {/* Estado: cargando */}
      {cargando && <p>Cargando equipos...</p>}

      {/* Estado: error */}
      {error && <p className="error">{error}</p>}

      {/* Estado: sin resultados (RF-002.2 - FA-01) */}
      {!cargando && !error && equiposFiltrados.length === 0 && (
        <p>No se encontraron equipos.</p>
      )}

      {/* Listado de equipos en tarjetas */}
      <div className="equipos-grid">
        {equiposFiltrados.map((equipo) => (
          <div className="equipo-card" key={equipo.id_equipo}>
            {/* El escudo viene guardado como imagen en base64 */}
            <img
              src={equipo.escudo}
              alt={`Escudo de ${equipo.nombre_equipo}`}
              className="equipo-escudo"
            />

            <h3>{equipo.nombre_equipo}</h3>

            <p>
              Responsable: {equipo.nombre_usuario} {equipo.apellido_usuario}
            </p>

            {/* Botón "Ver Jugadores": visible para TODOS, es consulta
                pública (igual que ver el listado de equipos) */}
            <div className="equipo-acciones">
              <Link
                to={`/jugadoresEquipo/${equipo.id_equipo}`}
                className="btn-ver-jugadores"
              >
                Ver Jugadores
              </Link>
            </div>

            {/* Estos botones SOLO aparecen si el usuario tiene permiso
                (dueño del equipo o Administrador) */}
            {puedeGestionar(equipo) && (
              <div className="equipo-acciones">
                <Link
                  to={`/equipos/editar/${equipo.id_equipo}`}
                  className="btn-editar"
                >
                  Editar
                </Link>
                <Link
                  to={`/equipos/eliminar/${equipo.id_equipo}`}
                  className="btn-desactivar"
                >
                  Desactivar
                </Link>
                <Link
                  to={`/inscripcionEquipos/crear/${equipo.id_equipo}`}
                  className="btn-inscribir"
                >
                  Inscribir
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}