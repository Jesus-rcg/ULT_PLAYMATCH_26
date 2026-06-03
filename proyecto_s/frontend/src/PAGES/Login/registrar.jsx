import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Registrar = () => {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [usuario, setUsuario] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    fecha_nacimiento: "",
    telefono: "",
    email: "",
    password: "",
    id_rol: 3,
  });

  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUsuario((prev) => ({
      ...prev,
      [name]: name === "id_rol" ? Number(value) : value,
    }));
  };

  const validarEmail = async () => {
    if (!usuario.email) return;

    try {
      const response = await fetch(`${API}/usuarios/email/${usuario.email}`);

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

    if (
      !usuario.nombre_usuario ||
      !usuario.apellido_usuario ||
      !usuario.email ||
      !usuario.password
    ) {
      alert("Completa todos los campos");
      return;
    }

    if (emailError) {
      alert("Corrige el correo");
      return;
    }

    try {
      const response = await fetch(`${API}/auth/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();

      if (data.success) {
        alert("Usuario registrado correctamente");

        setUsuario({
          nombre_usuario: "",
          apellido_usuario: "",
          fecha_nacimiento: "",
          telefono: "",
          email: "",
          password: "",
          id_rol: 3,
        });

        navigate("/login");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="card-box">
        <h3>Registrar Usuario</h3>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Rol</label>
          <select
            className="opciones_rol"
            name="id_rol"
            value={usuario.id_rol}
            onChange={handleChange}
          >
            <option value={2}>Organizador</option>
            <option value={3}>Usuario</option>
          </select>

          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            type="text"
            name="nombre_usuario"
            placeholder="Nombre"
            value={usuario.nombre_usuario}
            onChange={handleChange}
            required
          />
          <label className="form-label">Apellido</label>
          <input
            className="form-control"
            type="text"
            name="apellido_usuario"
            placeholder="Apellido"
            value={usuario.apellido_usuario}
            onChange={handleChange}
            required
          />
          <label className="form-label">Fecha Nacimiento</label>
          <input
            className="form-control"
            type="date"
            name="fecha_nacimiento"
            placeholder="Fecha De Nacimiento"
            value={usuario.fecha_nacimiento}
            onChange={handleChange}
            required
          />

          <label className="form-label">Telefono</label>
          <input
            className="form-control"
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={usuario.telefono}
            onChange={handleChange}
            required
          />

          <label className="form-label">Correo</label>

          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            value={usuario.email}
            onChange={handleChange}
            onBlur={validarEmail}
            required
          />

          {emailError && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {emailError}
            </p>
          )}

          <label className="form-label">Contraseña</label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={usuario.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-main">
            Registrar
          </button>
        </form>

        <p onClick={() => navigate("/login")} className="link-text">
          ¿Ya tienes una cuenta?Inicia sesión
        </p>
      </div>
    </div>
  );
};

export default Registrar;
