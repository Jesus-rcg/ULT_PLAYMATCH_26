import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../STILO/estilosPages/torneos/torneo.css";

const API = import.meta.env.VITE_API_URL + "/torneos";

export default function Torneos() {
  const [torneos, setTorneos] = useState([]);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const getTorneos = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();

      setTorneos(data?.data || data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTorneos();
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

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );
  };

  const filtrados = torneos.filter(
    (t) =>
      (t.nombre_torneo || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.nombre_usuario || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.apellido_usuario || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.categoria || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.tipo_torneo || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.ciudad || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.fecha_inicio || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.fecha_fin || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.estado || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <div className="usuarios-header">
          <h2 className="titulo">Gestión de Torneos</h2>

          <div className="acciones-superiores">
            <button
              className="btn crear"
              onClick={() => navigate("/torneos/crear")}
            >
              Crear
            </button>
          </div>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre Del Torneo</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th>Ciudad</th>
              <th>Fecha De Inicio</th>
              <th>Fecha De Finalizacion</th>
              <th>Estado</th>
              <th colSpan="2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((t) => (
                <tr key={t.id_torneo}>
                  <td>{t.id_torneo}</td>
                  <td>
                    {t.nombre_usuario + " "}
                    {t.apellido_usuario}
                  </td>
                  <td>{t.nombre_torneo}</td>
                  <td>{t.categoria}</td>
                  <td>{t.tipo_torneo}</td>
                  <td>{t.ciudad}</td>
                  <td>{t.fecha_inicio?.split("T")[0] || ""}</td>
                  <td>{t.fecha_fin?.split("T")[0] || ""}</td>
                  <td>{t.estado}</td>

                  <td>
                    <button
                      className="btn editar"
                      onClick={() => navigate(`/torneos/editar/${t.id_torneo}`)}
                    >
                      Editar
                    </button>
                  </td>

                  <td>
                    <button
                      className="btn eliminar"
                      onClick={() =>
                        navigate(`/torneos/eliminar/${t.id_torneo}`)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No hay torneos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
