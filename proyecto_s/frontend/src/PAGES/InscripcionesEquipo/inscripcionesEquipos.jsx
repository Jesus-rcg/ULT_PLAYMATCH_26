import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../STILO/estilosPages/inscripcionEquipo/inscripcionEquipo.css";

const API = import.meta.env.VITE_API_URL + "/inscripcionEquipos";

export default function InscripcionEquipos() {
  const [inscripciones, setInscripciones] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Formatear fecha (evita duplicación)
  const formatFecha = (fecha) =>
    fecha ? new Date(fecha).toLocaleString("es-CO") : "";

  // 🔹 GET INSCRIPCIONES
  const getInscripciones = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Error al cargar inscripciones");
        return;
      }

      setInscripciones(data || []);
      setError("");
    } catch (error) {
      console.error("Error al obtener inscripciones:", error);
      setError("Error al conectar con el servidor");
    }
  };

  // 🔹 Cargar datos
  useEffect(() => {
    getInscripciones();
  }, [location.pathname]);

  // 🔹 Sync search con URL
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

  // 🔹 FILTRO
  const filtrados = inscripciones.filter((i) => {
    const texto = search.toLowerCase();

    return (
      i.nombre_torneo?.toLowerCase().includes(texto) ||
      i.nombre_equipo?.toLowerCase().includes(texto) ||
      i.estado?.toLowerCase().includes(texto) ||
      formatFecha(i.fecha_ins_equipo).toLowerCase().includes(texto)
    );
  });

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <h2 className="titulo">Inscripciones de Equipos</h2>

        {/* BOTÓN CREAR (FUERA DE THEAD) */}
        <div style={{ marginBottom: "10px" }}>
          <button
            className="btn crear"
            onClick={() => navigate("/inscripcionEquipos/Crear")}
          >
            Crear
          </button>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Torneo</th>
              <th>Equipo</th>
              <th>Fecha Inscripción</th>
              <th>Estado</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((i) => (
                <tr key={i.id_inscripcion_e}>
                  <td>{i.id_inscripcion_e}</td>
                  <td>{i.nombre_torneo}</td>
                  <td>{i.nombre_equipo}</td>
                  <td>{formatFecha(i.fecha_ins_equipo)}</td>
                  <td>{i.estado}</td>

                  <td>
                    <button
                      className="btn editar"
                      onClick={() =>
                        navigate(
                          `/inscripcionEquipos/Editar/${i.id_inscripcion_e}`,
                        )
                      }
                    >
                      Editar
                    </button>
                  </td>

                  <td>
                    <button
                      className="btn eliminar"
                      onClick={() =>
                        navigate(
                          `/inscripcionEquipos/Eliminar/${i.id_inscripcion_e}`,
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay inscripciones</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
