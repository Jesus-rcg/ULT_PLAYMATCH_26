import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCronologia,
  getJugadoresByEncuentro,
} from "../../SERVICE/cronologiasService";

const API_BASE = import.meta.env.VITE_API_URL;

export default function CronologiasCrear() {
  const navigate = useNavigate();

  const [encuentros, setEncuentros] = useState([]);
  const [jugadores, setJugadores] = useState([]);

  const [form, setForm] = useState({
    id_encuentro: "",
    id_jugador: "",
    evento: "Gol",
    minuto: "",
  });

  // 🔹 cargar encuentros
  useEffect(() => {
    const cargarEncuentros = async () => {
      try {
        const res = await fetch(`${API_BASE}/encuentros`);
        const data = await res.json();
        setEncuentros(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarEncuentros();
  }, []);

  // 🔹 cargar jugadores según encuentro (USANDO SERVICE)
  const cargarJugadores = async (id_encuentro) => {
    try {
      const data = await getJugadoresByEncuentro(id_encuentro);
      setJugadores(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // 🔥 cuando cambia encuentro, cargar jugadores
    if (name === "id_encuentro") {
      await cargarJugadores(value);

      setForm((prev) => ({
        ...prev,
        id_encuentro: value,
        id_jugador: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCronologia(form);
      navigate("/cronologias");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Cronología</h2>

      <form onSubmit={handleSubmit}>
        {/* Encuentro */}
        <select
          name="id_encuentro"
          value={form.id_encuentro}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione encuentro</option>

          {encuentros.map((e) => (
            <option key={e.id_encuentro} value={e.id_encuentro}>
              {e.equipo_local} vs {e.equipo_visitante}
            </option>
          ))}
        </select>

        {/* Jugadores */}
        <select
          name="id_jugador"
          value={form.id_jugador}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione jugador</option>

          {jugadores.map((j) => (
            <option key={j.id_jugador} value={j.id_jugador}>
              {j.nombre_usuario} {j.apellido_usuario} - {j.nombre_equipo}
            </option>
          ))}
        </select>

        {/* Evento */}
        <select name="evento" value={form.evento} onChange={handleChange}>
          <option value="Gol">Gol</option>
          <option value="Amarilla">Amarilla</option>
          <option value="Roja">Roja</option>
        </select>

        {/* Minuto */}
        <input
          type="number"
          name="minuto"
          placeholder="Minuto"
          value={form.minuto}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn crear">
          Guardar
        </button>
      </form>
    </div>
  );
}
