import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../CONTEXT/AuthContext";
import "../../STILO/estilosPages/usuarios/usuario.css";

const API = import.meta.env.VITE_API_URL + "/torneos";

export default function TorneoEliminar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [torneo, setTorneo] = useState({
    nombre_torneo: "",
    categoria: "",
    tipo_torneo: "",
    ciudad: "",
  });

  // GET TORNEO
  const getTorneo = async () => {
    try {
      const res = await fetch(`${API}/${id}`);

      const data = await res.json();

      if (!res.ok) {
        console.error("ERROR BACKEND:", data?.message);
        return;
      }

      setTorneo({
        nombre_torneo: data?.nombre_torneo || "",
        ciudad: data?.ciudad || "",
        categoria: data?.categoria || "",
        tipo_torneo: data?.tipo_torneo || "",
      });
    } catch (err) {
      console.error("ERROR:", err.message);
    }
  };

  useEffect(() => {
    if (id) getTorneo();
  }, [id]);

  // DELETE (SOFT DELETE)
  const eliminarTorneo = async () => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Error eliminando torneo");
      }

      navigate("/torneos");
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  return (
    <div className="usuarios-container">
      <div className="card-box-usuario">
        <h2 className="titulo">Eliminar Torneo</h2>

        <form className="form-usuarios">
          <input type="text" value={torneo.nombre_torneo} disabled />
          <input type="text" value={torneo.tipo_torneo} disabled />
          <input type="text" value={torneo.categoria} disabled />
          <input type="text" value={torneo.ciudad} disabled />

          <p style={{ color: "white", textAlign: "center" }}>
            ¿Deseas desactivar este torneo?
          </p>

          <button
            type="button"
            className="btn eliminar"
            onClick={eliminarTorneo}
          >
            Sí, Eliminar
          </button>

          <button
            type="button"
            className="btn editar"
            onClick={() => navigate("/torneos")}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
