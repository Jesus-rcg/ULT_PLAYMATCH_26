import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createJugador } from "../../SERVICE/jugadoresService.js";

export default function JugadorCrear() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_usuario: "",
    posicion: "",
    numero_camiseta: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createJugador(form);

      navigate("/jugadores");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Jugador</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id_usuario"
          placeholder="ID Usuario"
          value={form.id_usuario}
          onChange={handleChange}
          required
        />

        <select
          name="posicion"
          value={form.posicion}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione posición</option>
          <option value="Portero">Portero</option>
          <option value="Defensa">Defensa</option>
          <option value="Centrocampista">Centrocampista</option>
          <option value="Delantero">Delantero</option>
        </select>

        <input
          type="number"
          name="numero_camiseta"
          placeholder="Número Camiseta"
          value={form.numero_camiseta}
          onChange={handleChange}
          required
        />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
