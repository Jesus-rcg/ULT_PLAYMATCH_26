import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getEncuentros,
  generarFixtureAutomatico,
} from "../../SERVICE/encuentrosService";

import "../../STILO/estilosPages/usuarios/usuario.css";

export default function EncuentrosAdmin() {
  const navigate = useNavigate();

  const [encuentros, setEncuentros] = useState([]);

  const [loading, setLoading] = useState(false);

  const cargarEncuentros = async () => {
    try {
      const data = await getEncuentros();

      setEncuentros(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEncuentros();
  }, []);

  const handleGenerarFixture = async () => {
    try {
      setLoading(true);

      // EJEMPLO
      // ESTOS IDS PUEDEN VENIR
      // DE INSCRIPCIONES O EQUIPOS

      const datos = {
        id_torneo: 1,

        equipos: [1, 2, 3, 4, 5, 6],
      };

      const res = await generarFixtureAutomatico(datos);

      alert(res.message);

      cargarEncuentros();
    } catch (error) {
      console.error(error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="usuarios-container">
      <div className="tabla-container">
        <div className="header-tabla">
          <h2 className="titulo">Encuentros</h2>

          <div className="acciones-header">
            <button
              className="btn fixture"
              onClick={handleGenerarFixture}
              disabled={loading}
            >
              {loading ? "Generando..." : "Generar Fixture"}
            </button>

            <button
              className="btn crear"
              onClick={() => navigate("/encuentros/crear")}
            >
              Crear
            </button>
          </div>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>

              <th>Torneo</th>

              <th>Local</th>

              <th>Visitante</th>

              <th>Jornada</th>

              <th>Lugar</th>

              <th>Fecha</th>

              <th>Hora</th>

              <th>Estado</th>

              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {encuentros.length > 0 ? (
              encuentros.map((e) => (
                <tr key={e.id_encuentro}>
                  <td>{e.id_encuentro}</td>

                  <td>{e.nombre_torneo}</td>

                  <td>{e.equipo_local}</td>

                  <td>{e.equipo_visitante}</td>

                  <td>{e.jornada}</td>

                  <td>{e.lugar}</td>

                  <td>
                    {e.fecha?.split("T")[0].split("-").reverse().join("-")}
                  </td>

                  <td>{e.hora}</td>

                  <td>{e.estado}</td>

                  <td className="acciones">
                    <button
                      className="btn editar"
                      onClick={() =>
                        navigate(`/encuentros/editar/${e.id_encuentro}`)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn eliminar"
                      onClick={() =>
                        navigate(`/encuentros/eliminar/${e.id_encuentro}`)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No hay encuentros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
