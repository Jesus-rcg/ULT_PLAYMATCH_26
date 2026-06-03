import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../STILO/estilosPages/usuarios/usuario.css";

const API = import.meta.env.VITE_API_URL + "/usuarios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const getUsuarios = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setUsuarios(data?.data || []);
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  // SEARCH
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const params = new URLSearchParams(location.search);

    if (value.trim()) params.set("search", value);
    else params.delete("search");

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );
  };

  const filtrados = usuarios.filter(
    (u) =>
      (u.nombre_rol || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.nombre_usuario || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.apellido_usuario || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <h2 className="titulo">Gestión de Usuarios</h2>
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Rol</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha De Nacimiento</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
              <th>
                <button
                  className="btn crear"
                  onClick={() => navigate("/usuarios/crear")}
                >
                  Crear
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre_rol}</td>
                  <td>{u.nombre_usuario}</td>
                  <td>{u.apellido_usuario}</td>
                  <td>{u.fecha_nacimiento?.split("T")[0] || ""}</td>
                  <td>{u.telefono}</td>
                  <td>{u.email}</td>

                  <td>
                    <button
                      className="btn editar"
                      onClick={() => navigate(`/usuarios/editar/${u.id}`)}
                    >
                      Editar
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn eliminar"
                      onClick={() => navigate(`/usuarios/eliminar/${u.id}`)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
