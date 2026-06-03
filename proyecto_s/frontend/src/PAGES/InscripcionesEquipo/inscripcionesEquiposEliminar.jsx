import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../CONTEXT/AuthContext";
import "../../STILO/estilosPages/inscripcionEquipo/inscripcionEquipo.css";

const API = import.meta.env.VITE_API_URL + "/inscripcionEquipos";

export default function InscripcionEquipoEliminar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [inscripcion, setInscripcion] = useState({
    nombre_torneo: "",
    nombre_equipo: "",
    estado: "",
  });

  // GET INSCRIPCIÓN
  const getInscripcion = async () => {
    try {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("ERROR BACKEND:", data?.message);
        return;
      }

      setInscripcion({
        nombre_torneo: data?.nombre_torneo || "",
        nombre_equipo: data?.nombre_equipo || "",
        estado: data?.estado || "",
      });
    } catch (err) {
      console.error("ERROR:", err.message);
    }
  };

  useEffect(() => {
    if (id) getInscripcion();
  }, [id]);

  // DELETE (SOFT DELETE)
  const eliminarInscripcion = async () => {
    try {
      if (!token) {
        alert("No autorizado");
        return;
      }

      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Error eliminando inscripción");
      }

      navigate("/inscripcionEquipos");
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  return (
    <div className="usuarios-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Eliminar Inscripción</h2>

        <form className="form-usuarios">
          <input type="text" value={inscripcion.nombre_torneo} disabled />
          <input type="text" value={inscripcion.nombre_equipo} disabled />
          <input type="text" value={inscripcion.estado} disabled />

          <p style={{ color: "white", textAlign: "center" }}>
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
            onClick={() => navigate("/inscripcionEquipos")}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
