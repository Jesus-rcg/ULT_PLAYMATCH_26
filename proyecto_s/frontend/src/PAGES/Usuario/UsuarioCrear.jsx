import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../STILO/estilosPages/usuarios/usuario.css";

const API = import.meta.env.VITE_API_URL;

export default function UsuarioCrear() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");

  const [form, setForm] = useState({
    id_rol: 3,
    nombre_usuario: "",
    apellido_usuario: "",
    telefono: "",
    email: "",
    password: "",
    fecha_nacimiento: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "id_rol" ? Number(e.target.value) : e.target.value,
    }));
  };

  const validarEmail = async () => {
    if (!form.email) return;

    try {
      const response = await fetch(`${API}/usuarios/email/${form.email}`);

      const data = await response.json();

      if (data.existe) {
        setEmailError("Este correo ya existe");
      } else {
        setEmailError("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError) {
      alert("Corrige el correo");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error creando usuario");
      }

      navigate("/usuarios");
    } catch (err) {
      console.error(err.message);
      alert("No se pudo crear el usuario");
    }
  };

  return (
    <div className="login-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Crear Usuario</h2>

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
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
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
            onBlur={validarEmail}
          />

          {emailError && (
            <p style={{ color: "red", fontSize: "14px" }}>{emailError}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />

          <button className="btn crear" type="submit">
            Crear
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
