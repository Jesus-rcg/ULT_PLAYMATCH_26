import { useNavigate, useParams } from "react-router-dom";
import { deleteResultado } from "../../SERVICE/resultadosService";

export default function ResultadosEliminar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteResultado(id);

      navigate("/resultados");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="eliminar-container">
      <h2>¿Deseas eliminar este resultado?</h2>

      <button className="btn eliminar" onClick={handleDelete}>
        Sí, eliminar
      </button>

      <button className="btn" onClick={() => navigate("/resultados")}>
        Cancelar
      </button>
    </div>
  );
}
