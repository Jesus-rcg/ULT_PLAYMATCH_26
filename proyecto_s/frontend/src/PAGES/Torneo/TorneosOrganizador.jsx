import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMisTorneos, deleteTorneo } from "../../SERVICE/torneoService";
import "../../STILO/estilosPages/torneoCard.css";
import trofeo from "../../ASSETS/trofeo.jpg";

export default function TorneosOrganizador() {
  const [torneos, setTorneos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getMisTorneos();
        setTorneos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };

    cargar();
  }, []);

  const eliminarTorneo = async (id_torneo) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este torneo?",
    );

    if (!confirmar) return;

    try {
      await deleteTorneo(id_torneo);

      setTorneos((prev) => prev.filter((t) => t.id_torneo !== id_torneo));

      alert("Torneo eliminado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el torneo");
    }
  };

  return (
    <div>
      <div className="header-torneos">
        <h2>Mis Torneos</h2>

        <button
          className="btn-crear"
          onClick={() => navigate("/torneos/crear")}
        >
          Crear Torneo
        </button>
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
                    <br />
                    <br />
                  </p>
                </div>
              </div>

              <div className="foot-data">
                <p className="estado">
                  <strong>Estado:</strong> {t.estado}
                  <br />
                </p>
                <div className="acciones-card">
                  <button
                    className="btn-editar"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/torneos/editar/${t.id_torneo}`);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-eliminar"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarTorneo(t.id_torneo);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No tienes torneos creados</p>
        )}
      </div>
    </div>
  );
}
