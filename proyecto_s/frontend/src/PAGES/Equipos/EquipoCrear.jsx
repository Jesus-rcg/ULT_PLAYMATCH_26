import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEquipo } from "../../SERVICE/equiposService.js";

export default function EquipoCrear() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_usuario: "",
    escudo: "",
    nombre_equipo: "",
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
      await createEquipo(form);

      navigate("/equipos");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Equipo</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id_usuario"
          placeholder="ID Usuario"
          value={form.id_usuario}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="escudo"
          placeholder="URL Escudo"
          value={form.escudo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="nombre_equipo"
          placeholder="Nombre Equipo"
          value={form.nombre_equipo}
          onChange={handleChange}
          required
        />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
