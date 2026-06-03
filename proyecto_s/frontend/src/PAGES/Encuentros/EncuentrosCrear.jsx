import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createEncuentro } from "../../SERVICE/encuentrosService";

import "../../STILO/estilosPages/encuentros/encuentros.css";

export default function EncuentrosCrear() {
  const navigate = useNavigate();
  const { id_torneo } = useParams();

  const [form, setForm] = useState({
    id_torneo: id_torneo,
    id_equipo_local: "",
    id_equipo_visitante: "",
    jornada: "",
    lugar: "",
    fecha: "",
    hora: "",
    estado: "Pendiente",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEncuentro(form);

      navigate(`/torneo/${id_torneo}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Encuentro</h2>

      <form onSubmit={handleSubmit}>
        <p>
          <strong>Torneo:</strong> {id_torneo}
        </p>

        <input
          type="number"
          name="id_equipo_local"
          placeholder="Equipo Local"
          value={form.id_equipo_local}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="id_equipo_visitante"
          placeholder="Equipo Visitante"
          value={form.id_equipo_visitante}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="jornada"
          placeholder="Jornada"
          value={form.jornada}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lugar"
          placeholder="Lugar"
          value={form.lugar}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="hora"
          value={form.hora}
          onChange={handleChange}
          required
        />

        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="Pendiente">Pendiente</option>
          <option value="Jugando">Jugando</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Aplazado">Aplazado</option>
        </select>

        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
