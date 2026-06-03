import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../STILO/estilosPages/usuarios/usuario.css";

const API = import.meta.env.VITE_API_URL + "/usuarios";

export default function UsuarioEliminar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    id_rol: "",
    nombre_usuario: "",
    apellido_usuario: "",
    telefono: "",
    email: "",
  });

  const getUsuario = async () => {
    try {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();

      setUsuario({
        id_rol: data?.data?.id_rol || "",
        nombre_usuario: data?.data?.nombre_usuario || "",
        apellido_usuario: data?.data?.apellido_usuario || "",
        telefono: data?.data?.telefono || "",
        email: data?.data?.email || "",
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUsuario();
  }, [id]);

  const eliminarUsuario = async () => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error eliminando usuario");

      navigate("/usuarios");
    } catch (err) {
      console.error(err.message);
      alert("No se pudo eliminar el usuario");
    }
  };

  return (
    <div className="usuarios-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Eliminar Usuario</h2>

        <form className="form-usuarios">
          <input
            type="text"
            name="nombre_usuario"
            placeholder="Nombre"
            value={usuario.nombre_usuario || ""}
            disabled
          />

          <input
            type="text"
            name="apellido_usuario"
            placeholder="Apellido"
            value={usuario.apellido_usuario || ""}
            disabled
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={usuario.telefono || ""}
            disabled
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={usuario.email || ""}
            disabled
          />

          <p
            style={{
              color: "white",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            ¿Deseas Eliminar Este Usuario?
          </p>

          <button
            className="btn eliminar"
            type="button"
            onClick={eliminarUsuario}
          >
            Sí, eliminar
          </button>

          <button
            className="btn editar"
            type="button"
            onClick={() => navigate("/usuarios")}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
