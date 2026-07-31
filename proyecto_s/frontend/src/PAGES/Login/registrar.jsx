import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../STILO/estilosPages/registrarse.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
    confirmarPassword: "",
    id_rol:""
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false)

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

    const requisitos = {
    longitud: usuario.password.length >= 8 &&
              usuario.password.length <= 16,
    mayuscula: /[A-Z]/.test(usuario.password),
    minuscula: /[a-z]/.test(usuario.password),
    numero: /\d/.test(usuario.password),
    especial: /[!@#$%^&*(),.":|<>]/.test(usuario.password),

    }
    
    const validacionContraseña =
    requisitos.longitud &&
    requisitos.especial &&
    requisitos.minuscula &&
    requisitos.mayuscula &&
    requisitos.numero;


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
      !usuario.password ||
      !usuario.confirmarPassword
    ) {
      alert("Completa todos los campos");
      return;
    }

    if (emailError) {
      alert("Corrige el correo");
      return;
    } 

    if(!validacionContraseña){
      setPasswordError(
        "La contraseña no cumple con los requisitos de seguridad"
      );
      return;
    }
    
    if(usuario.password !== usuario.confirmarPassword){ 
      setPasswordError("Las contraseñas no coinciden");
      return;

    }

    try {
      const response = await fetch(`${API}/auth/enviar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();

      if (data.success) {
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
          confirmarPassword: "",
        });

        navigate("/codigo-registro",{
          state:{
            email: usuario.email,
          },
        });

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

                <div className="password-wrapper">

                  <label className="form-label">Contraseña</label>

                  <div className="password-input">
                    <input
                      className="form-control password-control"
                      type={mostrarPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña"
                      value={usuario.password}
                      onChange={handleChange}
                      onFocus={() => setMostrarRequisitos(true)}
                      onBlur={() => setMostrarRequisitos(false)}
                      required
                    />

                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                    >
                      {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>

                  {mostrarRequisitos && (
                    <div className="password-card">

                      <h4>La contraseña debe contener:</h4>

                      <p className={requisitos.longitud ? "ok" : "bad"}>
                        {requisitos.longitud ? "✔" : "✖"} Entre 8 y 16 caracteres
                      </p>

                      <p className={requisitos.mayuscula ? "ok" : "bad"}>
                        {requisitos.mayuscula ? "✔" : "✖"} Una letra mayúscula
                      </p>

                      <p className={requisitos.minuscula ? "ok" : "bad"}>
                        {requisitos.minuscula ? "✔" : "✖"} Una letra minúscula
                      </p>

                      <p className={requisitos.numero ? "ok" : "bad"}>
                        {requisitos.numero ? "✔" : "✖"} Un número
                      </p>

                      <p className={requisitos.especial ? "ok" : "bad"}>
                        {requisitos.especial ? "✔" : "✖"} Un carácter especial
                      </p>

                    </div>
                  )}

                </div>


            </div>

            <div className="form-group-full">

                <label className="form-label">Confirmar contraseña</label>
                <div className="password-input">
                  <input
                      className="form-control password-control"
                      type={mostrarConfirmarPassword ? "text" : "password"}
                      name="confirmarPassword"
                      placeholder="Contraseña"
                      value={usuario.confirmarPassword}
                      onChange={handleChange}
                      required
          
                  />

                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                  >
                    {mostrarConfirmarPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>

                </div>
                  
                  {passwordError && (
                    <p className="password-error">
                      {passwordError}
                    </p>
                  )}
                

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
