import { useNavigate, useParams } from "react-router-dom";
import { deleteJugador } from "../../SERVICE/jugadoresService.js";

export default function JugadorEliminar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteJugador(id);
      navigate("/jugadores");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Eliminar Jugador</h2>

      <p>¿Desea eliminar este jugador?</p>

      <button className="btn eliminar" onClick={handleDelete}>
        Eliminar
      </button>
    </div>
  );
}
