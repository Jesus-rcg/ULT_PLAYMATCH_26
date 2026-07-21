import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../CONTEXT/AuthContext";
import { ROLES } from "../CONSTANTES/roles";
import "../STILO/estilosComponents/sidebar.css";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const rolActual = Number(user?.rol);

  const rolNombre = {
    1: "Administrador",
    2: "Organizador",
    3: "Usuario",
  };

  // Menú agrupado por secciones
  const secciones = [
    {
      label: "General",
      items: [
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR, ROLES.USUARIO],
          label: "Inicio",
          path: "/home",
          icon: "🏠",
        },
        {
          roles: [ROLES.ADMINISTRADOR],
          label: "Usuarios",
          path: "/usuarios",
          icon: "👥",
        },
      ],
    },
    {
      label: "Torneos y Equipos",
      items: [
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR, ROLES.USUARIO],
          label: "Torneos",
          path: "/torneos",
          icon: "🏆",
        },
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR, ROLES.USUARIO],
          label: "Equipos",
          path: "/equipos",
          icon: "🛡️",
        },
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR, ROLES.USUARIO],
          label: "Jugadores",
          path: "/jugadores",
          icon: "🏃",
        },
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR],
          label: "Inscripción de Equipos",
          path: "/inscripcionEquipos",
          icon: "📋",
        },
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR],
          label: "Inscripción de Jugadores",
          path: "/inscripcionJugadores",
          icon: "📝",
        },
      ],
    },
    {
      label: "Competencia",
      items: [
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR, ROLES.USUARIO],
          label: "Encuentros",
          path: "/encuentros",
          icon: "⚔️",
        },
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR, ROLES.USUARIO],
          label: "Resultados",
          path: "/resultados",
          icon: "📊",
        },
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR, ROLES.USUARIO],
          label: "Posiciones",
          path: "/posiciones",
          icon: "📈",
        },
        {
          roles: [ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR],
          label: "Cronologías",
          path: "/cronologias",
          icon: "📅",
        },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-topbar">
        {rolNombre[rolActual] || "Sin rol"}
      </div>

      <ul className="sidebar-menu">
        {secciones.map((seccion) => {
          const itemsFiltrados = seccion.items.filter((item) =>
            item.roles.includes(rolActual)
          );

          if (itemsFiltrados.length === 0) return null;

          return (
            <li key={seccion.label}>
              <div className="sidebar-section-label">{seccion.label}</div>
              <ul style={{ listStyle: "none" }}>
                {itemsFiltrados.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
