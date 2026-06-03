import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInscripcionJugador } from "../../SERVICE/inscripcionJugadoresService.js";
import { getEquipos } from "../../SERVICE/equiposService.js";
import { getJugadores } from "../../SERVICE/jugadoresService.js";
import "../../STILO/estilosPages/inscripcionEquipo/inscripcionEquipo.css";

export default function InscripcionJugadorCrear() {
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id_equipo: "",
    id_jugador: "",
  });

  /* =========================
     GET EQUIPOS
  ========================= */
  const cargarEquipos = async () => {
    try {
      const data = await getEquipos();

      setEquipos(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     GET JUGADORES
  ========================= */
  const cargarJugadores = async () => {
    try {
      const data = await getJugadores();

      setJugadores(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     LOAD
  ========================= */
  useEffect(() => {
    cargarEquipos();
    cargarJugadores();
  }, []);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await createInscripcionJugador(form);

      navigate("/inscripcionJugadores");
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Error al crear inscripción");
    }
  };

  return (
    <div className="usuarios-container">
      <div className="form-container">
        <h2 className="titulo">Crear Inscripción de Jugador</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="formulario">
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

          {/* JUGADOR */}
          <div className="grupo-form">
            <label>Jugador</label>

            <select
              name="id_jugador"
              value={form.id_jugador}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un jugador</option>

              {jugadores.map((j) => (
                <option key={j.id_jugador} value={j.id_jugador}>
                  {j.nombre_usuario}
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
              onClick={() => navigate("/inscripcionJugadores")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
