import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getJugadorById,
  updateJugador,
} from "../../SERVICE/jugadoresService.js";

export default function JugadorEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_usuario: "",
    posicion: "",
    numero_camiseta: "",
  });

  const cargarJugador = async () => {
    try {
      const data = await getJugadorById(id);

      setForm({
        id_usuario: data.id_usuario || "",
        posicion: data.posicion || "",
        numero_camiseta: data.numero_camiseta || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarJugador();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateJugador(id, form);
      navigate("/jugadores");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Jugador</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id_usuario"
          value={form.id_usuario}
          onChange={handleChange}
        />

        <select name="posicion" value={form.posicion} onChange={handleChange}>
          <option value="">Seleccione posición</option>
          <option value="Portero">Portero</option>
          <option value="Defensa">Defensa</option>
          <option value="Centrocampista">Centrocampista</option>
          <option value="Delantero">Delantero</option>
        </select>

        <input
          type="number"
          name="numero_camiseta"
          value={form.numero_camiseta}
          onChange={handleChange}
        />

        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
}
