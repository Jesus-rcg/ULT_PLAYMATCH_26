import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../STILO/estilosPages/inscripcionEquipo/inscripcionEquipo.css";

const API = import.meta.env.VITE_API_URL;

export default function InscripcionEquipoCrear() {
  const navigate = useNavigate();

  const [torneos, setTorneos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id_torneo: "",
    id_equipo: "",
  });

  // TORNEOS
  const getTorneos = async () => {
    try {
      const res = await fetch(`${API}/torneos`);
      const data = await res.json();
      setTorneos(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // EQUIPOS
  const getEquipos = async () => {
    try {
      const res = await fetch(`${API}/equipos`);
      const data = await res.json();
      setEquipos(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTorneos();
    getEquipos();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/inscripcionEquipos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), // SOLO torneo + equipo
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al crear inscripción");
        return;
      }

      navigate("/inscripcionEquipos");
    } catch (error) {
      console.error(error);
      setError("Error del servidor");
    }
  };

  return (
    <div className="usuarios-container">
      <div className="form-container">
        <h2 className="titulo">Crear Inscripción de Equipo</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="formulario">
          {/* TORNEO */}
          <div className="grupo-form">
            <label>Torneo</label>
            <select
              name="id_torneo"
              value={form.id_torneo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un torneo</option>
              {torneos.map((t) => (
                <option key={t.id_torneo} value={t.id_torneo}>
                  {t.nombre_torneo}
                </option>
              ))}
            </select>
          </div>

          {/* EQUIPO */}
          <div className="grupo-form">
            <label>Equipo</label>
            <select
              name="id_equipo"
              value={form.id_equipo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un equipo</option>
              {equipos.map((e) => (
                <option key={e.id_equipo} value={e.id_equipo}>
                  {e.nombre_equipo}
                </option>
              ))}
            </select>
          </div>

          {/* BOTONES */}
          <div className="acciones-form">
            <button type="submit" className="btn crear">
              Guardar
            </button>

            <button
              type="button"
              className="btn cancelar"
              onClick={() => navigate("/inscripcionEquipos")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
