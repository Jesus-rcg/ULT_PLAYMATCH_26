import { useNavigate, useParams } from "react-router-dom";

import { deleteEncuentro } from "../../SERVICE/encuentrosService";

import "../../STILO/estilosPages/encuentros/encuentros.css";

export default function EncuentrosEliminar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteEncuentro(id);

      navigate("/encuentros");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="eliminar-container">
      <h2>¿Deseas eliminar este encuentro?</h2>

      <div className="acciones-eliminar">
        <button className="btn eliminar" onClick={handleDelete}>
          Sí, eliminar
        </button>

        <button
          className="btn cancelar"
          onClick={() => navigate("/encuentros")}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
