import { useNavigate, useParams } from "react-router-dom";

import { deleteEquipo } from "../../SERVICE/equiposService.js";

export default function EquipoEliminar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteEquipo(id);

      navigate("/equipos");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Eliminar Equipo</h2>

      <p>¿Desea eliminar este equipo?</p>

      <button className="btn eliminar" onClick={handleDelete}>
        Eliminar
      </button>
    </div>
  );
}
