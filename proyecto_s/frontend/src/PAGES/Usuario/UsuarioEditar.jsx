import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../STILO/estilosPages/usuarios/usuario.css";

const API = import.meta.env.VITE_API_URL + "/usuarios";

export default function UsuarioEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_rol: "",
    nombre_usuario: "",
    apellido_usuario: "",
    telefono: "",
    email: "",
  });

  // 🔥 MEJORA: manejo de errores + await seguro
  const getUsuario = async () => {
    try {
      const res = await fetch(`${API}/${id}`);

      if (!res.ok) {
        throw new Error("Error cargando usuario");
      }

      const data = await res.json();
      const user = data?.data || {};

      setForm({
        id_rol: user.id_rol || "",
        nombre_usuario: user.nombre_usuario || "",
        apellido_usuario: user.apellido_usuario || "",
        telefono: user.telefono || "",
        email: user.email || "",
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUsuario();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Error actualizando usuario");
      }

      navigate("/usuarios");
    } catch (err) {
      console.error(err.message);
      alert("No se pudo actualizar el usuario");
    }
  };

  return (
    <div className="usuarios-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Editar Usuario</h2>

        <form className="form-usuarios" onSubmit={handleSubmit}>
          <select
            className="opciones_rol"
            name="id_rol"
            value={form.id_rol}
            onChange={handleChange}
          >
            <option value={2}>Organizador</option>
            <option value={3}>Usuario</option>
          </select>

          <input
            name="nombre_usuario"
            placeholder="Nombre"
            value={form.nombre_usuario}
            onChange={handleChange}
          />

          <input
            name="apellido_usuario"
            placeholder="Apellido"
            value={form.apellido_usuario}
            onChange={handleChange}
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />

          <button className="btn editar" type="submit">
            Actualizar
          </button>

          <button
            type="button"
            className="btn eliminar"
            onClick={() => navigate("/usuarios")}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
