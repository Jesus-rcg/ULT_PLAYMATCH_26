import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../STILO/estilosPages/registrarse.css";

const Registrar = () => {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [usuario, setUsuario] = useState({
    id_usuario: "",
    id_documento: "",
    nombre_usuario: "",
    apellido_usuario: "",
    fecha_nacimiento: "",
    telefono: "",
    email: "",
    password: "",
    id_rol:""
  });

  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUsuario((prev) => ({
      ...prev,
      [name]: name === "id_rol" || name === "id_documento" ? Number(value) : value,
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

    console.log(usuario);

    if (
      !usuario.id_usuario ||
      !usuario.id_documento ||
      !usuario.id_rol ||
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
          id_usuario: "",
          id_documento: "", 
          nombre_usuario: "",
          apellido_usuario: "",
          fecha_nacimiento: "",
          telefono: "",
          email: "",
          password: "",
          id_rol: "",
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
    <div className="registro-container">
      <div className="card-registrar">
        <h3>Registrar Usuario</h3>
        <h3>⚽ Crear cuenta</h3>
        <p className="subtitle">
          Únete a PlayMatch y comienza a gestionar torneos,
          administrar equipos o participar como entrenador desde una sola plataforma.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

              <div className="form-group">
                  <label className="form-label">Rol</label>

                  <select
                      className="opciones_rol"
                      name="id_rol"
                      value={usuario.id_rol}
                      onChange={handleChange}
                  >
                      <option value="">Seleccione un rol</option>
                      <option value={2}>Organizador</option>
                      <option value={5}>Entrenador</option>
                  </select>
              </div>

              <div className="form-group">
                  <label className="form-label">Tipo documento</label>

                  <select
                      className="opciones_documento"
                      name="id_documento"
                      value={usuario.id_documento}
                      onChange={handleChange}
                  >
                      <option value="">Seleccione un tipo</option>
                      <option value={1}>Cédula</option>
                      <option value={2}>Tarjeta de identidad</option>
                  </select>
              </div>

              <div className="form-group">
                  <label className="form-label">Número de documento</label>

                  <input
                      className="form-control"
                      type="text"
                      name="id_usuario"
                      value={usuario.id_usuario}
                      onChange={handleChange}
                  />
              </div>

              <div className="form-group">
                  <label className="form-label">Fecha nacimiento</label>

                  <input
                      className="form-control"
                      type="date"
                      name="fecha_nacimiento"
                      value={usuario.fecha_nacimiento}
                      onChange={handleChange}
                  />
              </div>

              <div className="form-group">
                  <label className="form-label">Nombre</label>

                  <input
                      className="form-control"
                      type="text"
                      name="nombre_usuario"
                      value={usuario.nombre_usuario}
                      onChange={handleChange}
                  />
              </div>

              <div className="form-group">
                  <label className="form-label">Apellido</label>

                  <input
                      className="form-control"
                      type="text"
                      name="apellido_usuario"
                      value={usuario.apellido_usuario}
                      onChange={handleChange}
                  />
              </div>



            </div>

            <div className="form-group-full">
              <label className="form-label">Teléfono</label>

              <input
                  className="form-control"
                  type="text"
                  name="telefono"
                  value={usuario.telefono}
                  onChange={handleChange}
              />
            </div>

            <div className="form-group-full">

                <label className="form-label">Correo electrónico</label>

                <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={usuario.email}
                    onChange={handleChange}
                    onBlur={validarEmail}
                />

            </div>

            <div className="form-group-full">

                <label className="form-label">Contraseña</label>

                <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={usuario.password}
                    onChange={handleChange}
                />

            </div>

            <button className="btn-main">
                Crear cuenta
            </button>

          </form>

        <p onClick={() => navigate("/login")} className="link-text">
          ¿Ya tienes una cuenta?, Inicia sesión
        </p>
      </div>
    </div>
  );
};

export default Registrar;
