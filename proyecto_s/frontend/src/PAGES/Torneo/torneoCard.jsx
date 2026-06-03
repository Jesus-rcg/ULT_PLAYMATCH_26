import { useNavigate } from "react-router-dom";
import "../../STILO/estilosComponents/navbar.css";
import trofeo from "../../ASSETS/trofeo.jpg";

export default function TorneoCard({ torneo }) {
  const navigate = useNavigate();

  return (
    <div className="torneos-container">
      <div
        className="torneo-card"
        onClick={() => navigate(`/torneo/${torneo.id_torneo}`)}
      >
        <h2 className="torneo-title">{torneo.nombre_torneo}</h2>
        <div className="data-container">
          <div className="img-torneo">
            <img src={trofeo} alt="Logo" />
          </div>
          <div className="data-torneo">
            <p>
              <strong>Torneo:</strong> {torneo.tipo_torneo}
              <br />
              <strong>Categoría:</strong> {torneo.categoria}
              <br />
              <strong>Ciudad:</strong> {torneo.ciudad}
              <br />
              <strong>Inicia:</strong>{" "}
              {torneo.fecha_inicio?.split("T")[0] || ""}
              <br />
              <br />
              <br />
            </p>
          </div>
        </div>
        <div className="foot-data">
          <p className="estado">
            <strong>Estado: </strong> {torneo.estado}
          </p>
        </div>
      </div>
    </div>
  );
}
