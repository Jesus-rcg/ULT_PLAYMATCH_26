import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEquipoById, updateEquipo } from "../../SERVICE/equiposService.js";

export default function EquipoEditar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_usuario: "",
    escudo: "",
    nombre_equipo: "",
  });

  const cargarEquipo = async () => {
    try {
      const data = await getEquipoById(id);

      setForm(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEquipo();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateEquipo(id, form);

      navigate("/equipos");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Equipo</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id_usuario"
          value={form.id_usuario}
          onChange={handleChange}
        />

        <input
          type="text"
          name="escudo"
          value={form.escudo}
          onChange={handleChange}
        />

        <input
          type="text"
          name="nombre_equipo"
          value={form.nombre_equipo}
          onChange={handleChange}
        />

        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
}
