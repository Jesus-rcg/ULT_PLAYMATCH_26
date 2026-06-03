import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResultado } from "../../SERVICE/resultadosService";

export default function ResultadosCrear() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_encuentro: "",
    goles_local: 0,
    goles_visitante: 0,
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
      await createResultado(form);

      navigate("/resultados");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Resultado</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id_encuentro"
          placeholder="ID Encuentro"
          value={form.id_encuentro}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="goles_local"
          placeholder="Goles Local"
          value={form.goles_local}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="goles_visitante"
          placeholder="Goles Visitante"
          value={form.goles_visitante}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn crear">
          Guardar
        </button>
      </form>
    </div>
  );
}
