import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import ResultadoAdmin from "./ResultadoAdmin";
import ResultadoOrganizador from "./ResultadoOrganizador";
import ResultadoJugador from "./ResultadoJugador";

export default function Resultados() {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ADMINISTRADOR) {
    return <ResultadoAdmin />;
  }

  return <ResultadoOrganizador />;
}
