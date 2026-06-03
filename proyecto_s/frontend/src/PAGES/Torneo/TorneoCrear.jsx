import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../CONTEXT/AuthContext";
import "../../STILO/estilosPages/torneos/torneo.css";

const API = import.meta.env.VITE_API_URL + "/torneos";

export default function TorneoCrear() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre_torneo: "",
    categoria: "Amateur",
    tipo_torneo: "Liga",
    ciudad: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "Inscripciones Abiertas",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validarFormulario = () => {
    if (
      !form.nombre_torneo ||
      !form.ciudad ||
      !form.fecha_inicio ||
      !form.fecha_fin
    ) {
      setError("Completa todos los campos");
      return false;
    }

    if (form.fecha_inicio > form.fecha_fin) {
      setError("La fecha inicio no puede ser mayor a la fecha fin");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 VALIDACIÓN MÁS SEGURA
    if (!token) {
      setError("No hay sesión activa");
      return;
    }

    if (!validarFormulario()) return;

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error creando torneo");
        return;
      }

      navigate("/torneos");
    } catch (error) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Crear Torneo</h2>

        <form className="form-usuarios" onSubmit={handleSubmit}>
          <label className="form-label">Nombre Del Torneo</label>
          <input
            name="nombre_torneo"
            placeholder="Nombre del torneo"
            value={form.nombre_torneo}
            onChange={handleChange}
          />

          <label className="form-label">Categoria</label>
          <select
            className="opciones_rol"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
          >
            <option value="Amateur">Amateur</option>
            <option value="Profesional">Profesional</option>
            <option value="Semiprofesional">Semiprofesional</option>
            <option value="Sub 20">Sub 20</option>
            <option value="Sub 17">Sub 17</option>
            <option value="Sub 15">Sub 15</option>
            <option value="Pony">Pony</option>
          </select>

          <label className="form-label">Tipo De Torneo</label>
          <select
            className="opciones_rol"
            name="tipo_torneo"
            value={form.tipo_torneo}
            onChange={handleChange}
          >
            <option value="Liga">Liga</option>
            <option value="Grupos">Grupos</option>
            <option value="Eliminacion Directa">Eliminacion Directa</option>
          </select>

          <label className="form-label">Ciudad</label>
          <input
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
          />

          <label className="form-label">Fecha De Inicio</label>
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
          />

          <label className="form-label">Fecha De Finalizacion</label>
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Crear</button>
          <button type="button" onClick={() => navigate("/torneos")}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
