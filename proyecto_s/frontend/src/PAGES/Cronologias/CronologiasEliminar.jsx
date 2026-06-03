// PAGES/Cronologias/CronologiasEliminar.jsx

import { useNavigate, useParams } from "react-router-dom";

import { deleteCronologia } from "../../SERVICE/cronologiasService";

export default function CronologiasEliminar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteCronologia(id);

      navigate("/cronologias");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="eliminar-container">
      <h2>¿Deseas eliminar esta cronología?</h2>

      <button className="btn eliminar" onClick={handleDelete}>
        Sí, eliminar
      </button>

      <button className="btn" onClick={() => navigate("/cronologias")}>
        Cancelar
      </button>
    </div>
  );
}
