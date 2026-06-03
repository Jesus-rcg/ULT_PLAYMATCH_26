import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getResultadoById,
  updateResultado,
} from "../../SERVICE/resultadosService";

export default function ResultadosEditar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_encuentro: "",
    goles_local: 0,
    goles_visitante: 0,
  });

  useEffect(() => {
    cargarResultado();
  }, []);

  const cargarResultado = async () => {
    try {
      const data = await getResultadoById(id);

      setForm({
        id_encuentro: data.id_encuentro,
        goles_local: data.goles_local,
        goles_visitante: data.goles_visitante,
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
      await updateResultado(id, form);

      navigate("/resultados");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Resultado</h2>

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
          name="goles_local"
          value={form.goles_local}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="goles_visitante"
          value={form.goles_visitante}
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
