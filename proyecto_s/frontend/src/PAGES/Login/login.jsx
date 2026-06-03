import { useState, useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { loginRequest } from "../../SERVICE/authService";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../CONSTANTES/roles";
import "../../STILO/estilosPages/login.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAuth({
      ...auth,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await loginRequest(auth);

      const { token, user } = res;

      // 🔥 NORMALIZACIÓN SEGURA DEL ROL
      const userData = {
        ...user,
        rol: user.rol ?? user.id_rol,
      };

      login(token, userData);

      // 🔥 REDIRECCIÓN SEGÚN ROL
      if (userData.rol === ROLES.ADMINISTRADOR) {
        navigate("/usuarios");
        return;
      }

      if (userData.rol === ROLES.ORGANIZADOR) {
        navigate("/torneos");
        return;
      }

      if (userData.rol === ROLES.USUARIO) {
        navigate("/equipos");
        return;
      }

      navigate("/no-autorizado");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card-box">
        <h3>Iniciar sesión</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="form-control"
              value={auth.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="****"
              className="form-control"
              value={auth.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-main" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-links">
          <p onClick={() => navigate("/registro")} className="link-text">
            ¿No tienes cuenta? Registrarse
          </p>

          <p
            onClick={() => navigate("/forgot-password")}
            className="link-text disabled"
          >
            ¿Olvidaste tu contraseña?
          </p>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
