import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../CONTEXT/AuthContext";

import "../../STILO/estilosPages/inscripcionEquipo/inscripcionEquipo.css";

import {
  getInscripcionJugadorById,
  deleteInscripcionJugador,
} from "../../SERVICE/inscripcionJugadoresService.js";

export default function InscripcionJugadorEliminar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { token } = useContext(AuthContext);

  const [inscripcion, setInscripcion] = useState({
    nombre_equipo: "",
    nombre_usuario: "",
    posicion: "",
    estado: "",
  });

  /* =========================
     GET INSCRIPCIÓN
  ========================= */
  const cargarInscripcion = async () => {
    try {
      const data = await getInscripcionJugadorById(id);

      setInscripcion({
        nombre_equipo: data?.nombre_equipo || "",

        nombre_usuario: data?.nombre_usuario || data?.nombre || "",

        posicion: data?.posicion || "",

        estado: data?.estado || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     LOAD
  ========================= */
  useEffect(() => {
    if (id) {
      cargarInscripcion();
    }
  }, [id]);

  /* =========================
     DELETE
  ========================= */
  const eliminarInscripcion = async () => {
    try {
      if (!token) {
        alert("No autorizado");
        return;
      }

      await deleteInscripcionJugador(id);

      navigate("/inscripcionJugadores");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Error eliminando inscripción");
    }
  };

  return (
    <div className="usuarios-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Eliminar Inscripción</h2>

        <form className="form-usuarios">
          <input type="text" value={inscripcion.nombre_equipo} disabled />

          <input type="text" value={inscripcion.nombre_usuario} disabled />

          <input type="text" value={inscripcion.posicion} disabled />

          <input type="text" value={inscripcion.estado} disabled />

          <p
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            ¿Deseas desactivar esta inscripción?
          </p>

          <button
            type="button"
            className="btn eliminar"
            onClick={eliminarInscripcion}
          >
            Sí, Eliminar
          </button>

          <button
            type="button"
            className="btn editar"
            onClick={() => navigate("/inscripcionJugadores")}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
