import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createEncuentro } from "../../SERVICE/encuentrosService";

import "../../STILO/estilosPages/encuentros/encuentros.css";

export default function EncuentrosCrear() {
  const navigate = useNavigate();
  const { id_torneo } = useParams();

  const [form, setForm] = useState({
    id_torneo,
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

      navigate(`/encuentros/${id_torneo}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Crear Encuentro</h2>

        <form className="form-usuarios" onSubmit={handleSubmit}>
          <label className="form-label">Torneo</label>

          <input value={id_torneo || ""} disabled />

          <label className="form-label">Equipo Local</label>

          <input
            type="number"
            name="id_equipo_local"
            value={form.id_equipo_local}
            onChange={handleChange}
            required
          />

          <label className="form-label">Equipo Visitante</label>

          <input
            type="number"
            name="id_equipo_visitante"
            value={form.id_equipo_visitante}
            onChange={handleChange}
            required
          />

          <label className="form-label">Jornada</label>

          <input
            type="number"
            name="jornada"
            value={form.jornada}
            onChange={handleChange}
            required
          />

          <label className="form-label">Lugar</label>

          <input
            type="text"
            name="lugar"
            value={form.lugar}
            onChange={handleChange}
            required
          />

          <label className="form-label">Fecha</label>

          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />

          <label className="form-label">Hora</label>

          <input
            type="time"
            name="hora"
            value={form.hora}
            onChange={handleChange}
            required
          />

          <label className="form-label">Estado</label>

          <select
            className="opciones_rol"
            name="estado"
            value={form.estado}
            onChange={handleChange}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Jugando">Jugando</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Aplazado">Aplazado</option>
          </select>

          <button type="submit">Crear</button>

          <button
            type="button"
            onClick={() => navigate(`/encuentros/${id_torneo}`)}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
