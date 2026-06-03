import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getEncuentroById,
  updateEncuentro,
} from "../../SERVICE/encuentrosService";

import "../../STILO/estilosPages/encuentros/encuentros.css";

export default function EncuentrosEditar() {
  const { id } = useParams(); // id del encuentro
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_torneo: null,
    id_equipo_local: "",
    id_equipo_visitante: "",
    jornada: "",
    lugar: "",
    fecha: "",
    hora: "",
    estado: "",
  });

  const [loading, setLoading] = useState(true);

  // CARGAR ENCUENTRO
  useEffect(() => {
    if (!id) return;

    const cargar = async () => {
      try {
        const data = await getEncuentroById(id);

        setForm({
          id_torneo: data?.id_torneo ?? null,
          id_equipo_local: data?.id_equipo_local ?? "",
          id_equipo_visitante: data?.id_equipo_visitante ?? "",
          jornada: data?.jornada ?? "",
          lugar: data?.lugar ?? "",
          fecha: data?.fecha ? data.fecha.split("T")[0] : "",
          hora: data?.hora ?? "",
          estado: data?.estado ?? "",
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // GUARDAR
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateEncuentro(id, form);

      // fallback seguro
      if (!form.id_torneo) {
        console.error("id_torneo no existe");
        return;
      }

      navigate(-1); // vuelve a la página anterior
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="login-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Editar Encuentro</h2>

        <form className="form-usuarios" onSubmit={handleSubmit}>
          <label className="form-label">Torneo</label>

          <input value={form.id_torneo || ""} disabled />

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

          <button type="submit">Actualizar</button>

          <button type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
