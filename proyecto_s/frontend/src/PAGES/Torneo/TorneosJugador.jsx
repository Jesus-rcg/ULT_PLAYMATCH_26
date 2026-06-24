import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTorneos } from "../../SERVICE/torneoService";

import "../../STILO/estilosPages/torneoCard.css";
import trofeo from "../../ASSETS/trofeo.jpg";

export default function TorneosJugador() {
  const [torneos, setTorneos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getTorneos();
        setTorneos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };

    cargar();
  }, []);

  return (
    <div>
      <div className="header-torneos">
        <h2>Torneos Disponibles</h2>
      </div>

      <div className="torneos-container">
        {torneos.length > 0 ? (
          torneos.map((t) => (
            <div
              key={t.id_torneo}
              className="torneo-card"
              onClick={() => navigate(`/torneo/${t.id_torneo}`)}
            >
              <h3 className="torneo-title">{t.nombre_torneo}</h3>

              <div className="data-container">
                <div className="img-torneo">
                  <img src={trofeo} alt="Torneo" />
                </div>

                <div className="data-torneo">
                  <p>
                    <strong>Categoría:</strong> {t.categoria}
                    <br />
                    <strong>Tipo:</strong> {t.tipo_torneo}
                    <br />
                    <strong>Ciudad:</strong> {t.ciudad}
                    <br />
                    <strong>Inicio:</strong>{" "}
                    {t.fecha_inicio
                      ?.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                  </p>
                </div>
              </div>

              <div className="foot-data">
                <p className="estado">
                  <strong>Estado:</strong> {t.estado}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No hay torneos disponibles</p>
        )}
      </div>
    </div>
  );
}
