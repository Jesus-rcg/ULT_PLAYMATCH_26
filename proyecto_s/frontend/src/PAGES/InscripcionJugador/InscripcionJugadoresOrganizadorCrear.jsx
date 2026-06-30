import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createInscripcionJugador } from "../../SERVICE/inscripcionJugadoresService";
import { getEquipoById } from "../../SERVICE/equiposService";
import { getJugadores } from "../../SERVICE/jugadoresService";

import "../../STILO/estilosPages/inscripcionEquipo/inscripcionEquipo.css";

export default function InscripcionJugadoresOrganizadorCrear() {
  const navigate = useNavigate();
  const { idEquipo } = useParams();

  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id_equipo: idEquipo,
    id_jugador: "",
  });

  // Obtener información del equipo
  const cargarEquipo = async () => {
    try {
      const data = await getEquipoById(idEquipo);
      setEquipo(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener jugadores
  const cargarJugadores = async () => {
    try {
      const data = await getJugadores();
      setJugadores(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEquipo();
    cargarJugadores();
  }, [idEquipo]);

  const handleChange = (e) => {
    setForm({
      ...form,
      id_jugador: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await createInscripcionJugador({
        id_equipo: idEquipo,
        id_jugador: form.id_jugador,
      });

      navigate(`/jugadoresEquipo/${idEquipo}`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Error al crear la inscripción",
      );
    }
  };

  return (
    <div className="usuarios-container">
      <div className="form-container">
        <h2 className="titulo">Inscribir Jugador al Equipo</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="formulario">
          {/* Equipo */}
          <div className="grupo-form">
            <label>Equipo</label>

            <input type="text" value={equipo?.nombre_equipo || ""} disabled />
          </div>

          {/* Jugador */}
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
                  {j.nombre_usuario} {j.apellido_usuario}
                </option>
              ))}
            </select>
          </div>

          <div className="acciones-form">
            <button type="submit" className="btn crear">
              Inscribir
            </button>

            <button
              type="button"
              className="btn cancelar"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
