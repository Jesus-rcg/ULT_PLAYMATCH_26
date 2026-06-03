import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../../STILO/estilosPages/inscripcionEquipo/inscripcionEquipo.css";

import { getInscripcionesJugadores } from "../../SERVICE/inscripcionJugadoresService.js";

export default function InscripcionJugadores() {
  const [inscripciones, setInscripciones] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Formatear fecha
  const formatFecha = (fecha) =>
    fecha ? new Date(fecha).toLocaleString("es-CO") : "";

  // 🔹 GET INSCRIPCIONES
  const cargarInscripciones = async () => {
    try {
      const data = await getInscripcionesJugadores();

      setInscripciones(data || []);
      setError("");
    } catch (error) {
      console.error("Error al obtener inscripciones:", error);

      setError(
        error.response?.data?.message || "Error al conectar con el servidor",
      );
    }
  };

  // 🔹 Cargar datos
  useEffect(() => {
    cargarInscripciones();
  }, [location.pathname]);

  // 🔹 Sync search con URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSearch(params.get("search") || "");
  }, [location.search]);

  // 🔹 Buscar
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

  // 🔹 FILTRO
  const filtrados = inscripciones.filter((i) => {
    const texto = search.toLowerCase();

    return (
      i.nombre?.toLowerCase().includes(texto) ||
      i.nombre_equipo?.toLowerCase().includes(texto) ||
      i.posicion?.toLowerCase().includes(texto) ||
      i.estado?.toLowerCase().includes(texto) ||
      formatFecha(i.fecha_inscripcion).toLowerCase().includes(texto)
    );
  });

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <h2 className="titulo">Inscripciones de Jugadores</h2>

        {/* 🔹 ERROR */}
        {error && <p className="error-text">{error}</p>}

        {/* 🔹 BOTÓN CREAR */}
        <div style={{ marginBottom: "10px" }}>
          <button
            className="btn crear"
            onClick={() => navigate("/inscripcionJugadores/Crear")}
          >
            Crear
          </button>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipo</th>
              <th>Jugador</th>
              <th>Posición</th>
              <th>Camiseta</th>
              <th>Fecha Inscripción</th>
              <th>Estado</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((i) => (
                <tr key={i.id_inscripcion_j}>
                  <td>{i.id_inscripcion_j}</td>

                  <td>{i.nombre_equipo}</td>

                  <td>{i.nombre}</td>

                  <td>{i.posicion}</td>

                  <td>{i.numero_camiseta}</td>

                  <td>{formatFecha(i.fecha_inscripcion)}</td>

                  <td>{i.estado}</td>

                  <td>
                    <button
                      className="btn editar"
                      onClick={() =>
                        navigate(
                          `/inscripcionJugadores/Editar/${i.id_inscripcion_j}`,
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
                          `/inscripcionJugadores/Eliminar/${i.id_inscripcion_j}`,
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
                <td colSpan="9">No hay inscripciones</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
