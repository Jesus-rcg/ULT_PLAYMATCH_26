import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../STILO/estilosPages/login.css";

const API = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/auth/forgot-password`, {
        email,
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Error al enviar el correo");
    }
  };

  return (
    <div className="login-container">
      <div className="card-box">
        <h3>Recuperar contraseña</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-main">
            Enviar
          </button>
        </form>

        <div className="login-links">
          <p onClick={() => navigate("/")} className="link-text">
            Volver al login
          </p>
        </div>

        {message && <p className="error">{message}</p>}
      </div>
    </div>
  );
}
