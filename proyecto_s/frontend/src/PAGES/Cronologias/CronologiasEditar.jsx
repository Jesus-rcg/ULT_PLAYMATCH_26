import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCronologiaById,
  updateCronologia,
} from "../../SERVICE/cronologiasService";

export default function CronologiasEditar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_encuentro: "",
    id_jugador: "",
    evento: "Gol",
    minuto: "",
  });

  useEffect(() => {
    cargarCronologia();
  }, []);

  const cargarCronologia = async () => {
    try {
      const data = await getCronologiaById(id);

      setForm({
        id_encuentro: data.id_encuentro,
        id_jugador: data.id_jugador,
        evento: data.evento,
        minuto: data.minuto,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCronologia(id, form);

      navigate("/cronologias");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Cronología</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id_encuentro"
          value={form.id_encuentro}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="id_jugador"
          value={form.id_jugador}
          onChange={handleChange}
          required
        />

        <select name="evento" value={form.evento} onChange={handleChange}>
          <option value="Gol">Gol</option>
          <option value="Amarilla">Amarilla</option>
          <option value="Roja">Roja</option>
        </select>

        <input
          type="number"
          name="minuto"
          value={form.minuto}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn editar">
          Actualizar
        </button>
      </form>
    </div>
  );
}
