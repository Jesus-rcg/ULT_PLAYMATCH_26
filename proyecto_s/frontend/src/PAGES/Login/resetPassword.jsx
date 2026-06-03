import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../STILO/estilosPages/login.css";

const API = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // ✅ obtener token desde query params
  const token = new URLSearchParams(location.search).get("token");

  // 🔥 validar si el token existe
  useEffect(() => {
    if (!token) {
      setMessage("Token inválido o no proporcionado");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("No hay token válido");
      return;
    }

    try {
      const res = await axios.post(`${API}/auth/reset-password`, {
        token,
        password,
      });

      setMessage(res.data.message || "Contraseña actualizada");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error al cambiar contraseña",
      );
    }
  };

  return (
    <div className="login-container">
      <div className="card-box">
        <h3>Nueva contraseña</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingresa tu nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-main" disabled={!token}>
            Guardar contraseña
          </button>
        </form>

        {message && <p className="error">{message}</p>}
      </div>
    </div>
  );
}
