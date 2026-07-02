import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../CONTEXT/AuthContext";
import { ROLES } from "../CONSTANTES/roles";
import "../STILO/estilosComponents/sidebar.css";

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  const rolActual = Number(user?.rol); // 🔥 FIX CLAVE

  const rolNombre = {
    1: "Administrador",
    2: "Organizador",
    3: "Usuario",
  };

  const menuItems = [
    {
      id: 1,
      roles: [ROLES.ADMINISTRADOR],
      label: "Usuarios",
      path: "/usuarios",
    },
    {
      id: 2,
      roles: [ROLES.ADMINISTRADOR],
      label: "Torneos",
      path: "/torneos",
    },
    {
      id: 1,
      roles: [ROLES.USUARIO],
      label: "Home",
      path: "/home",
    },
    {
      id: 2,
      roles: [ROLES.USUARIO],
      label: "Mi Equipo",
      path: "/equipos",
    },
    {
      id: 2,
      roles: [ROLES.ORGANIZADOR],
      label: "Mis Torneos",
      path: "/torneos",
    },
    {
      id: 3,
      roles: [ROLES.ADMINISTRADOR],
      label: "Inscripcion de Equipos",
      path: "/inscripcionEquipos",
    },
    {
      id: 4,
      roles: [ROLES.ADMINISTRADOR],
      label: "Equipos",
      path: "/equipos",
    },
    {
      id: 5,
      roles: [ROLES.ADMINISTRADOR],
      label: "Inscripcion de Jugadores",
      path: "/inscripcionJugadores",
    },
    {
      id: 6,
      roles: [ROLES.ADMINISTRADOR],
      label: "Jugadores",
      path: "/jugadores",
    },
    {
      id: 7,
      roles: [ROLES.ADMINISTRADOR],
      label: "Encuentros",
      path: "/encuentros",
    },
    {
      id: 8,
      roles: [ROLES.ADMINISTRADOR],
      label: "Cronologias",
      path: "/cronologias",
    },
    {
      id: 9,
      roles: [ROLES.ADMINISTRADOR],
      label: "Resultados",
      path: "/resultados",
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(rolActual),
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-topbar">
        <span>{rolNombre[rolActual] || "Sin rol"}</span>
      </div>

      <ul className="sidebar-menu">
        {filteredMenu.map((item) => (
          <li key={item.id}>
            <Link className="sidebar-link" to={item.path}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
