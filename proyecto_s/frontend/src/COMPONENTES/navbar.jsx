import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FaHome, FaBell, FaStar } from "react-icons/fa";
import { AuthContext } from "../CONTEXT/AuthContext";
import "../STILO/estilosComponents/navbar.css";
import logo from "../ASSETS/logo2.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    const params = new URLSearchParams(location.search);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );
  };

  const handleLogout = () => {
    logout();
    // ❌ NO navigate aquí porque logout ya redirige
  };

  // 🔥 NORMALIZAR NOMBRE (evita undefined)
  const nombreUsuario =
    `${user?.nombre_usuario ?? ""} ${user?.apellido_usuario ?? ""}`.trim() ||
    "Usuario";

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/home" className="navbar-logo">
        <div className="logoName">
          <div>
            <img src={logo} alt="Logo" className="logo" />
            PLAYMATCH
          </div>
        </div>
      </Link>

      {/* BUSCADOR */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={handleChange}
        />
      </div>

      <div className="block-2">
        {/* MENÚ */}
        {isAuthenticated && (
          <ul className="navbar-menu">
            <li>
              <Link to="/home" className="navbar-link icon-link">
                <FaHome />
                <span>Inicio</span>
              </Link>
            </li>

            <li>
              <Link to="/favoritos" className="navbar-link icon-link">
                <FaStar />
                <span>Favoritos</span>
              </Link>
            </li>

            <li>
              <Link to="/novedades" className="navbar-link icon-link">
                <FaBell />
                <span>Novedades</span>
              </Link>
            </li>
          </ul>
        )}

        <div className="navbar-actions">
          {!isAuthenticated ? (
            <div className="action-btn">
              <Link to="/registro" className="navbar-registrar">
                Registrar
              </Link>
              <Link to="/login" className="navbar-login">
                Login
              </Link>
            </div>
          ) : (
            <div className="navbar-user">
              <span className="user-name">{nombreUsuario}</span>

              <button className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
