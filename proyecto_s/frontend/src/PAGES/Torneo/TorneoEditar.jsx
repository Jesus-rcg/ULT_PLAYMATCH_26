import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import "../../STILO/estilosPages/torneos/torneo.css";

const API = import.meta.env.VITE_API_URL + "/torneos";

export default function TorneoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔥 ahora sí está definido
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    nombre_torneo: "",
    categoria: "",
    tipo_torneo: "",
    ciudad: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "",
    activo: 1,
  });

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const getTorneo = async () => {
    try {
      const res = await fetch(`${API}/${id}`);

      if (!res.ok) throw new Error("Error cargando torneo");

      const data = await res.json();
      const torneo = data?.data || data;

      setForm({
        nombre_torneo: torneo.nombre_torneo || "",
        categoria: torneo.categoria || "",
        tipo_torneo: torneo.tipo_torneo || "",
        ciudad: torneo.ciudad || "",
        fecha_inicio: formatDate(torneo.fecha_inicio),
        fecha_fin: formatDate(torneo.fecha_fin),
        estado: torneo.estado || "",
        activo: torneo.activo ?? 1,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getTorneo();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          categoria: form.categoria.trim(),
          tipo_torneo: form.tipo_torneo.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error actualizando torneo");
      }

      navigate("/torneos");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="usuarios-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Editar Torneo</h2>

        <form className="form-usuarios" onSubmit={handleSubmit}>
          <input
            name="nombre_torneo"
            value={form.nombre_torneo}
            onChange={handleChange}
            placeholder="Nombre"
          />

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

          <select
            className="opciones_rol"
            name="tipo_torneo"
            value={form.tipo_torneo}
            onChange={handleChange}
          >
            <option value="Liga">Liga</option>
            <option value="Grupos">Grupos</option>
            <option value="Eliminacion Directa">Eliminación Directa</option>
          </select>

          <input
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            placeholder="Ciudad"
          />

          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
          />

          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
          />

          <button className="btn editar" type="submit">
            Actualizar
          </button>

          <button
            type="button"
            className="btn eliminar"
            onClick={() => navigate("/torneos")}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
