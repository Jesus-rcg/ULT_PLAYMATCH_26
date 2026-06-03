import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getTorneos } from "../SERVICE/torneoService";
import TorneoCard from "./Torneo/torneoCard";
import "../STILO/estilosPages/torneoCard.css";

export default function Home() {
  const [torneos, setTorneos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const search = query.get("search") || "";

  //Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTorneos();
        setTorneos(data);
        setFiltrados(data);
      } catch (error) {
        console.error("Error al cargar torneos:", error);
      }
    };

    fetchData();
  }, []);

  //Filtro en frontend
  useEffect(() => {
    const resultados = torneos.filter((t) =>
      (t.nombre_torneo || "").toLowerCase().includes(search.toLowerCase()),
    );

    setFiltrados(resultados);
  }, [search, torneos]);

  return (
    <div>
      <h1>Torneos</h1>

      {filtrados.length === 0 && <p>No hay resultados</p>}

      {/* GRID CONTENEDOR */}
      <div className="torneos-container">
        {filtrados.map((t) => (
          <TorneoCard key={t.id_torneo} torneo={t} />
        ))}
      </div>
    </div>
  );
}
