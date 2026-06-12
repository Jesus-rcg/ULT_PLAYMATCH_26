import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FaHome, FaBell, FaStar } from "react-icons/fa";
import { AuthContext } from "../CONTEXT/AuthContext";
import "../STILO/estilosComponents/navbar.css";
import logo from "../ASSETS/logo1.png";

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

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/home" className="navbar-logo">
        <div>
          <div className="logoName">
            <img src={logo} alt="Logo" className="logo" />
            <div className="titulo-logo">PLAYMATCH</div>
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
              <div className="user-name">
                <span>{user.nombre_usuario}</span>
                <br />
                <span>{user.apellido_usuario}</span>
              </div>

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
